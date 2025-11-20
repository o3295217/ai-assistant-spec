'use client'

import { useState, useEffect } from 'react'

const periodTypes = [
  { key: 'dream', label: 'Мечта (5 лет)' },
  { key: 'year', label: 'Год' },
  { key: 'half_year', label: 'Полугодие' },
  { key: 'quarter', label: 'Квартал' },
  { key: 'month', label: 'Месяц' },
  { key: 'week', label: 'Неделя' },
]

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState('dream')
  const [dreamText, setDreamText] = useState('')
  const [periodGoals, setPeriodGoals] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadGoals()
  }, [activeTab])

  const loadGoals = async () => {
    setLoading(true)
    try {
      if (activeTab === 'dream') {
        const res = await fetch('/api/goals/dream')
        const data = await res.json()
        if (data.dream) {
          setDreamText(data.dream.goalText)
        }
      } else {
        const res = await fetch(`/api/goals/period?type=${activeTab}&date=${new Date().toISOString()}`)
        const data = await res.json()
        if (data.goals && data.goals.length > 0) {
          setPeriodGoals(data.goals.join('\n'))
        } else {
          setPeriodGoals('')
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveGoals = async () => {
    setLoading(true)
    setMessage('')
    try {
      if (activeTab === 'dream') {
        await fetch('/api/goals/dream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goalText: dreamText }),
        })
        setMessage('Мечта сохранена!')
      } else {
        const goalsArray = periodGoals.split('\n').filter(g => g.trim())
        await fetch('/api/goals/period', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            periodType: activeTab,
            goals: goalsArray,
            date: new Date().toISOString(),
          }),
        })
        setMessage('Цели сохранены!')
      }

      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving goals:', error)
      setMessage('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Управление целями</h1>

        {/* Табы */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {periodTypes.map((period) => (
              <button
                key={period.key}
                onClick={() => setActiveTab(period.key)}
                className={`${
                  activeTab === period.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {period.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Контент */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {activeTab === 'dream' ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Ваша мечта на 5 лет
              </label>
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Опишите вашу главную цель на 5 лет..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Цели на{' '}
                {periodTypes.find((p) => p.key === activeTab)?.label.toLowerCase()}
              </label>
              <textarea
                value={periodGoals}
                onChange={(e) => setPeriodGoals(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
                placeholder="Введите цели, каждая с новой строки..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Каждая цель с новой строки
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={saveGoals}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>

            {message && (
              <span className={`text-sm ${message.includes('Ошибка') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
