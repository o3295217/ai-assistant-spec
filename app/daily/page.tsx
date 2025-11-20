'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { getPeriodDates } from '@/lib/dates'

export default function DailyPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [planText, setPlanText] = useState('')
  const [factText, setFactText] = useState('')
  const [contextText, setContextText] = useState('')  // Новое поле
  const [weekGoals, setWeekGoals] = useState<string[]>([])
  const [monthGoals, setMonthGoals] = useState<string[]>([])
  const [dailyEntry, setDailyEntry] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedDate])

  const loadData = async () => {
    try {
      // Load daily entry
      const dailyRes = await fetch(`/api/daily?date=${selectedDate}`)
      const daily = await dailyRes.json()

      if (daily) {
        setDailyEntry(daily)
        setPlanText(daily.planText || '')
        setFactText(daily.factText || '')
        setContextText(daily.contextText || '')
      } else {
        setDailyEntry(null)
        setPlanText('')
        setFactText('')
        setContextText('')
      }

      // Load week goals
      const date = new Date(selectedDate)
      const { start: weekStart } = getPeriodDates(date, 'week')
      const weekRes = await fetch(`/api/goals/period?type=week&date=${weekStart.toISOString()}`)
      const weekData = await weekRes.json()
      setWeekGoals(weekData?.goals || [])

      // Load month goals
      const { start: monthStart } = getPeriodDates(date, 'month')
      const monthRes = await fetch(`/api/goals/period?type=month&date=${monthStart.toISOString()}`)
      const monthData = await monthRes.json()
      setMonthGoals(monthData?.goals || [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const savePlan = async () => {
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          planText,
        }),
      })

      const data = await res.json()
      setDailyEntry(data)
      setMessage('✅ План сохранен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving plan:', error)
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const saveFact = async () => {
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          factText,
        }),
      })

      const data = await res.json()
      setDailyEntry(data)
      setMessage('✅ Факт сохранен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving fact:', error)
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const saveContext = async () => {
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          contextText,
        }),
      })

      const data = await res.json()
      setDailyEntry(data)
      setMessage('✅ Контекст дня сохранен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving context:', error)
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const evaluate = async () => {
    if (!dailyEntry?.id) {
      setMessage('❌ Сначала сохраните план и факт')
      return
    }

    if (!factText) {
      setMessage('❌ Добавьте факт выполнения перед оценкой')
      return
    }

    setEvaluating(true)
    setMessage('⏳ Получение оценки от ИИ...')

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyEntryId: dailyEntry.id,
        }),
      })

      if (res.ok) {
        setMessage('✅ Оценка получена!')
        setTimeout(() => {
          router.push(`/evaluation/${selectedDate}`)
        }, 1000)
      } else {
        const error = await res.json()
        setMessage(`❌ Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error('Error evaluating:', error)
      setMessage('❌ Ошибка при получении оценки')
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ежедневное планирование</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input w-auto"
        />
      </div>

      <p className="text-lg text-gray-600">
        {format(new Date(selectedDate), 'd MMMM yyyy, EEEE', { locale: ru })}
      </p>

      {/* Context from periods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📌 Цели текущей недели:</h3>
          {weekGoals.length > 0 ? (
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {weekGoals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-blue-600">Не установлены</p>
          )}
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">📋 Цели текущего месяца:</h3>
          {monthGoals.length > 0 ? (
            <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
              {monthGoals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-purple-600">Не установлены</p>
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📝 План на день</h2>
        <textarea
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          className="textarea"
          placeholder="Введите план на день...&#10;&#10;Например:&#10;1. Утром - работа над ИИ ассистентом&#10;2. Калькулятор на 2026 год&#10;3. Штатное расписание на 2026"
          rows={8}
        />
        <button onClick={savePlan} disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить план'}
        </button>
      </div>

      {/* Fact */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">✅ Факт выполнения</h2>
        <textarea
          value={factText}
          onChange={(e) => setFactText(e.target.value)}
          className="textarea"
          placeholder="Введите что реально сделали за день...&#10;&#10;Например:&#10;1. ИИ ассистент - не сделал&#10;2. Калькулятор - готов&#10;3. Штатное расписание - не сделал"
          rows={8}
        />
        <button onClick={saveFact} disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить факт'}
        </button>
      </div>

      {/* Context */}
      <div className="card bg-amber-50 border border-amber-200">
        <h2 className="text-xl font-bold mb-2 text-amber-900">🌍 Контекст дня / Окружающий мир</h2>
        <p className="text-sm text-amber-700 mb-4">
          События, наблюдения, мысли, инсайты. Всё, что косвенно влияет на путь к мечте: изменения вокруг,
          отношения, здоровье, сны, прочитанные книги, случайные встречи.
        </p>
        <textarea
          value={contextText}
          onChange={(e) => setContextText(e.target.value)}
          className="textarea bg-white"
          placeholder="Например:&#10;- Газификацию в районе начали, дом можно будет продать дороже&#10;- Конфликт с женой, нет настроения работать&#10;- Прочитал книгу про делегирование, появилась идея&#10;- Встретил старого друга, предложил сотрудничество&#10;- Плохо спал, приснился странный сон про бизнес"
          rows={6}
        />
        <button onClick={saveContext} disabled={saving} className="btn-primary mt-4 disabled:opacity-50 bg-amber-600 hover:bg-amber-700">
          {saving ? 'Сохранение...' : 'Сохранить контекст'}
        </button>
      </div>

      {/* Evaluate */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200">
        <h2 className="text-xl font-bold mb-4">🤖 Получить оценку от ИИ</h2>
        <p className="text-gray-700 mb-4">
          После заполнения плана и факта, получите детальную оценку и обратную связь от ИИ-ассистента.
        </p>
        <button
          onClick={evaluate}
          disabled={evaluating || !factText}
          className="btn-primary disabled:opacity-50"
        >
          {evaluating ? 'Получение оценки...' : 'Получить оценку'}
        </button>
        {dailyEntry?.evaluation && (
          <p className="mt-4 text-sm text-green-700">
            ✅ Оценка за этот день уже получена. Вы можете получить новую оценку.
          </p>
        )}
      </div>

      {message && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
