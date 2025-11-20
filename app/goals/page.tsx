'use client'

import { useState, useEffect } from 'react'
import { getPeriodDates, getPeriodName, PeriodType } from '@/lib/dates'

type Tab = 'dream' | PeriodType

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dream')
  const [dreamGoal, setDreamGoal] = useState('')
  const [periodGoals, setPeriodGoals] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const today = new Date()

  useEffect(() => {
    loadGoals()
  }, [activeTab])

  const loadGoals = async () => {
    try {
      if (activeTab === 'dream') {
        const res = await fetch('/api/goals/dream')
        const data = await res.json()
        setDreamGoal(data?.goalText || '')
      } else {
        const { start } = getPeriodDates(today, activeTab as PeriodType)
        const res = await fetch(`/api/goals/period?type=${activeTab}&date=${start.toISOString()}`)
        const data = await res.json()
        setPeriodGoals(data?.goals?.join('\n') || '')
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    }
  }

  const saveGoals = async () => {
    setSaving(true)
    setMessage('')

    try {
      if (activeTab === 'dream') {
        await fetch('/api/goals/dream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goalText: dreamGoal }),
        })
      } else {
        const { start, end } = getPeriodDates(today, activeTab as PeriodType)
        const goals = periodGoals
          .split('\n')
          .map((g) => g.trim())
          .filter((g) => g)

        await fetch('/api/goals/period', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            periodType: activeTab,
            periodStart: start.toISOString(),
            periodEnd: end.toISOString(),
            goals,
          }),
        })
      }

      setMessage('✅ Сохранено успешно!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving goals:', error)
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dream', label: '🎯 Мечта (5 лет)' },
    { id: 'year', label: '📅 Год' },
    { id: 'half_year', label: '📆 Полугодие' },
    { id: 'quarter', label: '📊 Квартал' },
    { id: 'month', label: '📋 Месяц' },
    { id: 'week', label: '📌 Неделя' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Управление целями</h1>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card">
        {activeTab !== 'dream' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Период:</strong> {getPeriodName(today, activeTab as PeriodType)}
            </p>
          </div>
        )}

        {activeTab === 'dream' ? (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Ваша главная цель на 5 лет:</span>
              <textarea
                value={dreamGoal}
                onChange={(e) => setDreamGoal(e.target.value)}
                className="textarea"
                placeholder="Например: Стать топ-менеджером федеральной IT-компании..."
                rows={4}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">
                Цели на период (каждая цель с новой строки):
              </span>
              <textarea
                value={periodGoals}
                onChange={(e) => setPeriodGoals(e.target.value)}
                className="textarea"
                placeholder="Введите цели (каждая с новой строки)&#10;Например:&#10;Завершить систему оплаты труда РОП&#10;Согласовать KPI на декабрь"
                rows={8}
              />
            </label>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button onClick={saveGoals} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          {message && <span className="text-sm font-medium">{message}</span>}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Советы:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Цели должны быть конкретными и измеримыми</li>
          <li>Каждая цель периода должна работать на более долгосрочные цели</li>
          <li>Регулярно пересматривайте и обновляйте цели</li>
        </ul>
      </div>
    </div>
  )
}
