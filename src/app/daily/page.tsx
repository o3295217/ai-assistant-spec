'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import AlignmentVisualization from '@/components/AlignmentVisualization'

export default function DailyPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [planText, setPlanText] = useState('')
  const [factText, setFactText] = useState('')
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [message, setMessage] = useState('')
  const [evaluation, setEvaluation] = useState<any>(null)

  // Проверяем URL параметр при загрузке
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const dateParam = urlParams.get('date')
    if (dateParam) {
      setDate(dateParam)
    }
  }, [])

  useEffect(() => {
    loadDailyEntry()
  }, [date])

  const loadDailyEntry = async () => {
    setLoading(true)
    setEvaluation(null)
    try {
      const res = await fetch(`/api/daily?date=${date}`)
      const data = await res.json()

      if (data.entry) {
        setPlanText(data.entry.planText || '')
        setFactText(data.entry.factText || '')

        // Загружаем оценку если есть
        if (data.entry.evaluation) {
          setEvaluation(data.entry.evaluation)
        }
      } else {
        setPlanText('')
        setFactText('')
      }
    } catch (error) {
      console.error('Error loading daily entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePlan = async () => {
    setLoading(true)
    setMessage('')
    try {
      await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          planText,
        }),
      })
      setMessage('План сохранен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving plan:', error)
      setMessage('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const saveFact = async () => {
    setLoading(true)
    setMessage('')
    try {
      await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          factText,
        }),
      })
      setMessage('Факт сохранен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving fact:', error)
      setMessage('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const requestEvaluation = async () => {
    if (!planText || !factText) {
      setMessage('Необходимо заполнить и план, и факт')
      return
    }

    setEvaluating(true)
    setMessage('Отправка запроса к Claude API...')
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to evaluate')
      }

      const data = await res.json()
      setEvaluation(data.evaluation)
      setMessage('Оценка получена!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('Error evaluating:', error)
      setMessage(`Ошибка: ${error.message}`)
    } finally {
      setEvaluating(false)
    }
  }

  const dateFormatted = format(new Date(date), 'dd MMMM yyyy, EEEE', { locale: ru })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Планирование дня</h1>

        {/* Выбор даты */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {dateFormatted}
          </p>
        </div>

        {/* План на день */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">План на день</h2>
          <textarea
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите план на день..."
          />
          <button
            onClick={savePlan}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Сохранить план
          </button>
        </div>

        {/* Факт выполнения */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Факт выполнения</h2>
          <textarea
            value={factText}
            onChange={(e) => setFactText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Что реально сделали за день..."
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={saveFact}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Сохранить факт
            </button>
            <button
              onClick={requestEvaluation}
              disabled={evaluating || !planText || !factText}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {evaluating ? 'Получение оценки...' : 'Получить оценку от ИИ'}
            </button>
          </div>
        </div>

        {/* Сообщения */}
        {message && (
          <div className={`p-4 rounded-md mb-6 ${message.includes('Ошибка') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        {/* Оценка */}
        {evaluation && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Оценка дня</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold">{evaluation.strategyScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Стратегия</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold">{evaluation.operationsScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Операции</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold">{evaluation.teamScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Команда</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold">{evaluation.efficiencyScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Эффективность</div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className={`inline-block px-8 py-4 rounded-lg ${
                evaluation.overallScore >= 7 ? 'bg-green-100 text-green-800' :
                evaluation.overallScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className="text-4xl font-bold">{evaluation.overallScore.toFixed(1)}</div>
                <div className="text-sm">Общая оценка</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">План vs Факт:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {evaluation.planVsFactText}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Обратная связь:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {evaluation.feedbackText}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Рекомендации:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {evaluation.recommendationsText}
                </p>
              </div>

              {/* Визуализация alignment */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <AlignmentVisualization
                  alignmentDayWeek={evaluation.alignmentDayWeek}
                  alignmentWeekMonth={evaluation.alignmentWeekMonth}
                  alignmentMonthQuarter={evaluation.alignmentMonthQuarter}
                  alignmentQuarterHalf={evaluation.alignmentQuarterHalf}
                  alignmentHalfYear={evaluation.alignmentHalfYear}
                  alignmentYearDream={evaluation.alignmentYearDream}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
