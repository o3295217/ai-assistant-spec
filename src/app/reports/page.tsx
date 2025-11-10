'use client'

import { useState, useEffect } from 'react'
import { format, addWeeks, subWeeks } from 'date-fns'
import { ru } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface WeekReport {
  weekPeriod: {
    start: string
    end: string
    label: string
  }
  weekGoals: string[]
  weekStats: {
    totalDays: number
    evaluatedDays: number
    plannedDays: number
    completedDays: number
    averageScore: number
    averageStrategy: number
    averageOperations: number
    averageTeam: number
    averageEfficiency: number
  }
  dailyData: Array<{
    date: string
    fullDate: string
    score: number | null
    hasEvaluation: boolean
  }>
}

export default function WeekReportPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [report, setReport] = useState<WeekReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWeekReport()
  }, [currentDate])

  const loadWeekReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/week-report?date=${currentDate.toISOString()}`)
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Error loading week report:', error)
    } finally {
      setLoading(false)
    }
  }

  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  const thisWeek = () => {
    setCurrentDate(new Date())
  }

  if (loading || !report) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Недельный отчет</h1>
          <div className="text-center py-12">Загрузка...</div>
        </div>
      </main>
    )
  }

  const chartData = report.dailyData.map(d => ({
    день: d.date,
    Оценка: d.score,
  }))

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Недельный отчет</h1>

        {/* Навигация */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={previousWeek}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ← Предыдущая неделя
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{report.weekPeriod.label}</h2>
              <button
                onClick={thisWeek}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Текущая неделя
              </button>
            </div>
            <button
              onClick={nextWeek}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Следующая неделя →
            </button>
          </div>
        </div>

        {/* Цели недели */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Цели на неделю</h3>
          {report.weekGoals.length > 0 ? (
            <ul className="space-y-2">
              {report.weekGoals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">{index + 1}.</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Цели на эту неделю не установлены</p>
          )}
        </div>

        {/* Статистика недели */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{report.weekStats.totalDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Всего дней</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{report.weekStats.evaluatedDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Оценено</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {report.weekStats.averageScore > 0 ? report.weekStats.averageScore.toFixed(1) : '—'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Средняя оценка</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{report.weekStats.plannedDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Запланировано</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{report.weekStats.completedDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Выполнено</div>
          </div>
        </div>

        {/* График по дням */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Оценки по дням недели</h3>
          {chartData.some(d => d.Оценка !== null) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="день" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Оценка" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Нет оценок за эту неделю
            </div>
          )}
        </div>

        {/* Оценки по критериям */}
        {report.weekStats.evaluatedDays > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Средние оценки по критериям</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-2xl font-bold">{report.weekStats.averageStrategy.toFixed(1)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Стратегия</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <div className="text-2xl font-bold">{report.weekStats.averageOperations.toFixed(1)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Операции</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-2xl font-bold">{report.weekStats.averageTeam.toFixed(1)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Команда</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded">
                <div className="text-2xl font-bold">{report.weekStats.averageEfficiency.toFixed(1)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Эффективность</div>
              </div>
            </div>
          </div>
        )}

        {/* Выводы */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Выводы</h3>
          <div className="space-y-3">
            {report.weekStats.evaluatedDays === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                За эту неделю еще нет оцененных дней. Начните планировать и оценивать дни для получения аналитики.
              </p>
            ) : (
              <>
                <p>
                  За неделю оценено <strong>{report.weekStats.evaluatedDays}</strong> из {report.weekStats.totalDays} дней.
                  Средняя оценка составила <strong>{report.weekStats.averageScore.toFixed(1)}</strong> баллов.
                </p>

                {report.weekStats.averageScore >= 7 ? (
                  <p className="text-green-600 font-semibold">
                    🎉 Отличная неделя! Продолжайте в том же духе.
                  </p>
                ) : report.weekStats.averageScore >= 5 ? (
                  <p className="text-yellow-600 font-semibold">
                    👍 Хорошая неделя, но есть куда расти.
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    ⚠️ Неделя требует улучшения. Проанализируйте, что пошло не так.
                  </p>
                )}

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <h4 className="font-semibold mb-2">Рекомендации:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {report.weekStats.averageStrategy < 6 && (
                      <li>Уделите больше внимания стратегическому развитию</li>
                    )}
                    {report.weekStats.averageOperations < 6 && (
                      <li>Улучшите операционное управление</li>
                    )}
                    {report.weekStats.averageTeam < 6 && (
                      <li>Больше работайте с командой</li>
                    )}
                    {report.weekStats.averageEfficiency < 6 && (
                      <li>Повысьте эффективность использования времени</li>
                    )}
                    {report.weekStats.evaluatedDays < 5 && (
                      <li>Старайтесь оценивать каждый день для лучшей аналитики</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
