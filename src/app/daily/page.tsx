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
  const [isEditingPlan, setIsEditingPlan] = useState(false)
  const [isEditingFact, setIsEditingFact] = useState(false)
  const [hasExistingData, setHasExistingData] = useState(false)

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
    setMessage('')
    setHasExistingData(false)
    setIsEditingPlan(false)
    setIsEditingFact(false)
    
    try {
      const res = await fetch(`/api/daily?date=${date}`)
      const data = await res.json()

      if (data.entry) {
        const hasData = data.entry.planText || data.entry.factText
        
        if (hasData) {
          setHasExistingData(true)
          setPlanText(data.entry.planText || '')
          setFactText(data.entry.factText || '')
          
          // Загружаем оценку если есть
          if (data.entry.evaluation) {
            setEvaluation(data.entry.evaluation)
          }
        } else {
          // Нет данных - режим создания
          setPlanText('')
          setFactText('')
          setIsEditingPlan(true)
          setIsEditingFact(true)
        }
      } else {
        // Новый день - режим создания
        setPlanText('')
        setFactText('')
        setIsEditingPlan(true)
        setIsEditingFact(true)
      }
    } catch (error) {
      console.error('Error loading daily entry:', error)
      setMessage('Ошибка при загрузке данных')
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
      setIsEditingPlan(false)
      setHasExistingData(true)
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
      setIsEditingFact(false)
      setHasExistingData(true)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving fact:', error)
      setMessage('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const enableEditPlan = () => {
    setIsEditingPlan(true)
    setMessage('')
  }

  const enableEditFact = () => {
    setIsEditingFact(true)
    setMessage('')
  }

  const cancelEditPlan = async () => {
    setIsEditingPlan(false)
    await loadDailyEntry() // Перезагружаем данные
  }

  const cancelEditFact = async () => {
    setIsEditingFact(false)
    await loadDailyEntry() // Перезагружаем данные
  }

  const requestEvaluation = async () => {
    if (!planText || !factText) {
      setMessage('Необходимо заполнить и план, и факт')
      return
    }

    const confirmMessage = evaluation 
      ? 'Уже есть оценка для этого дня. Пересчитать оценку заново?' 
      : 'Отправить данные на оценку ИИ?'
    
    if (!window.confirm(confirmMessage)) {
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

  const getStatus = () => {
    if (evaluation) return { text: '✅ Оценен', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' }
    if (planText && factText) return { text: '⏳ Ожидает оценки', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' }
    if (planText) return { text: '📝 Есть план', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' }
    return { text: '🆕 Новый день', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400' }
  }

  const status = getStatus()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Планирование дня</h1>

        {/* Выбор даты */}
        <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
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
            
            <div className={`px-4 py-2 rounded-lg font-semibold ${status.color}`}>
              {status.text}
            </div>
          </div>
        </div>

        {/* План на день */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">План на день</h2>
            {hasExistingData && !isEditingPlan && (
              <button
                onClick={enableEditPlan}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
              >
                ✏️ Редактировать
              </button>
            )}
          </div>
          
          {isEditingPlan ? (
            <>
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Введите план на день..."
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={savePlan}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {hasExistingData ? 'Сохранить изменения' : 'Сохранить план'}
                </button>
                {hasExistingData && (
                  <button
                    onClick={cancelEditPlan}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-wrap">
              {planText || <span className="text-gray-400">План не заполнен</span>}
            </div>
          )}
        </div>

        {/* Факт выполнения */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Факт выполнения</h2>
            {hasExistingData && !isEditingFact && (
              <button
                onClick={enableEditFact}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
              >
                ✏️ Редактировать
              </button>
            )}
          </div>
          
          {isEditingFact ? (
            <>
              <textarea
                value={factText}
                onChange={(e) => setFactText(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Что реально сделали за день..."
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={saveFact}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {hasExistingData ? 'Сохранить изменения' : 'Сохранить факт'}
                </button>
                {hasExistingData && (
                  <button
                    onClick={cancelEditFact}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-wrap">
              {factText || <span className="text-gray-400">Факт не заполнен</span>}
            </div>
          )}
          
          {/* Кнопка получения оценки */}
          {!isEditingFact && !isEditingPlan && planText && factText && (
            <div className="mt-4">
              <button
                onClick={requestEvaluation}
                disabled={evaluating}
                className={`px-6 py-2 rounded-md font-semibold transition ${
                  evaluation
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white animate-pulse'
                } disabled:opacity-50`}
              >
                {evaluating 
                  ? '⏳ Получение оценки...' 
                  : evaluation 
                    ? '🔄 Пересчитать оценку' 
                    : '🎯 Получить оценку от ИИ'}
              </button>
              {!evaluation && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  💡 План и факт заполнены. Нажмите кнопку для получения оценки от Claude AI
                </p>
              )}
            </div>
          )}
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
