'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'

interface DailyEntry {
  id: number
  date: string
  planText: string | null
  factText: string | null
  evaluation: {
    overallScore: number
  } | null
}

export default function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [currentDate])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)

      const res = await fetch(
        `/api/daily/list?from=${start.toISOString()}&to=${end.toISOString()}`
      )
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getEntryForDate = (date: Date) => {
    return entries.find(entry =>
      isSameDay(new Date(entry.date), date)
    )
  }

  // Генерируем календарную сетку
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">История</h1>

        {/* Навигация по месяцам */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ← Предыдущий месяц
            </button>
            <h2 className="text-2xl font-semibold">
              {format(currentDate, 'LLLL yyyy', { locale: ru })}
            </h2>
            <button
              onClick={nextMonth}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Следующий месяц →
            </button>
          </div>

          {/* Календарная сетка */}
          <div className="grid grid-cols-7 gap-2">
            {/* Заголовки дней недели */}
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}

            {/* Дни месяца */}
            {calendarDays.map(day => {
              const entry = getEntryForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={`
                    min-h-24 p-2 border rounded-lg
                    ${isCurrentMonth ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}
                    ${isToday ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-600'}
                  `}
                >
                  <div className={`text-sm mb-1 ${!isCurrentMonth ? 'text-gray-400' : 'font-semibold'}`}>
                    {format(day, 'd')}
                  </div>

                  {entry && isCurrentMonth && (
                    <Link
                      href={`/daily?date=${format(day, 'yyyy-MM-dd')}`}
                      className="block"
                    >
                      {entry.evaluation ? (
                        <div className="space-y-1">
                          <div className={`
                            ${getScoreColor(entry.evaluation.overallScore)}
                            text-white text-center rounded py-1 px-2 text-sm font-bold
                          `}>
                            {entry.evaluation.overallScore.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            Оценен
                          </div>
                        </div>
                      ) : entry.factText ? (
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-center rounded py-1 px-2 text-xs">
                          Ожидает оценки
                        </div>
                      ) : entry.planText ? (
                        <div className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300 text-center rounded py-1 px-2 text-xs">
                          Есть план
                        </div>
                      ) : null}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* Легенда */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>7-10: Отлично</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>5-7: Хорошо</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>&lt;5: Требует улучшения</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 rounded"></div>
              <span>Ожидает оценки</span>
            </div>
          </div>
        </div>

        {/* Статистика за месяц */}
        {entries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Статистика за месяц</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-3xl font-bold">{entries.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Всего дней</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-3xl font-bold">
                  {entries.filter(e => e.evaluation).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Оценено</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-3xl font-bold">
                  {entries.filter(e => e.evaluation).length > 0
                    ? (entries.reduce((sum, e) => sum + (e.evaluation?.overallScore || 0), 0) /
                       entries.filter(e => e.evaluation).length).toFixed(1)
                    : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Средняя оценка</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <div className="text-3xl font-bold">
                  {entries.filter(e => e.planText && !e.factText).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Незавершенных</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
