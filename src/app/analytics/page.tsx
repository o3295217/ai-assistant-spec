'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TrendData {
  date: string
  overall: number | null
  strategy: number | null
  operations: number | null
  team: number | null
  efficiency: number | null
}

interface Stats {
  totalDays: number
  evaluatedDays: number
  averageScore: number
  maxScore: number
  minScore: number
  averageStrategy: number
  averageOperations: number
  averageTeam: number
  averageEfficiency: number
}

interface DayInfo {
  date: string
  score: number
  planText: string
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(30)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [topDays, setTopDays] = useState<DayInfo[]>([])
  const [worstDays, setWorstDays] = useState<DayInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/trend?days=${period}`)
      const data = await res.json()

      setTrendData(data.trendData || [])
      setStats(data.stats)
      setTopDays(data.topDays || [])
      setWorstDays(data.worstDays || [])
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Подготавливаем данные для графика
  const chartData = trendData
    .filter(d => d.overall !== null)
    .map(d => ({
      date: format(new Date(d.date), 'dd MMM', { locale: ru }),
      'Общая оценка': d.overall,
      'Стратегия': d.strategy,
      'Операции': d.operations,
      'Команда': d.team,
      'Эффективность': d.efficiency,
    }))

  const getTrendDirection = () => {
    if (chartData.length < 2) return 'neutral'
    const firstScore = chartData[0]['Общая оценка']
    const lastScore = chartData[chartData.length - 1]['Общая оценка']
    if (!firstScore || !lastScore) return 'neutral'
    if (lastScore > firstScore + 0.5) return 'up'
    if (lastScore < firstScore - 0.5) return 'down'
    return 'neutral'
  }

  const trend = getTrendDirection()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Аналитика</h1>

        {/* Выбор периода */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setPeriod(7)}
              className={`px-4 py-2 rounded-md ${
                period === 7
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              7 дней
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`px-4 py-2 rounded-md ${
                period === 30
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              30 дней
            </button>
            <button
              onClick={() => setPeriod(60)}
              className={`px-4 py-2 rounded-md ${
                period === 60
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              60 дней
            </button>
            <button
              onClick={() => setPeriod(90)}
              className={`px-4 py-2 rounded-md ${
                period === 90
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              90 дней
            </button>
          </div>
        </div>

        {/* Основная статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Средняя оценка</div>
              <div className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</div>
              <div className="text-sm mt-2">
                {trend === 'up' && <span className="text-green-600">↗️ Рост</span>}
                {trend === 'down' && <span className="text-red-600">↘️ Спад</span>}
                {trend === 'neutral' && <span className="text-gray-600">→ Стабильно</span>}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Оценено дней</div>
              <div className="text-3xl font-bold">{stats.evaluatedDays}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                из {stats.totalDays} дней
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Лучший день</div>
              <div className="text-3xl font-bold text-green-600">{stats.maxScore.toFixed(1)}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Худший день</div>
              <div className="text-3xl font-bold text-red-600">{stats.minScore.toFixed(1)}</div>
            </div>
          </div>
        )}

        {/* График динамики */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Динамика оценок</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Общая оценка" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Стратегия" stroke="#10b981" strokeWidth={1.5} />
                <Line type="monotone" dataKey="Операции" stroke="#f59e0b" strokeWidth={1.5} />
                <Line type="monotone" dataKey="Команда" stroke="#8b5cf6" strokeWidth={1.5} />
                <Line type="monotone" dataKey="Эффективность" stroke="#ef4444" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Недостаточно данных для отображения графика. Начните оценивать дни!
            </div>
          )}
        </div>

        {/* Средние оценки по критериям */}
        {stats && stats.evaluatedDays > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Средние оценки по критериям</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Стратегическое развитие</span>
                  <span className="font-semibold">{stats.averageStrategy.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageStrategy / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Операционное управление</span>
                  <span className="font-semibold">{stats.averageOperations.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageOperations / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Работа с командой</span>
                  <span className="font-semibold">{stats.averageTeam.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageTeam / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Эффективность времени</span>
                  <span className="font-semibold">{stats.averageEfficiency.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageEfficiency / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Топ-3 лучших и худших дня */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🏆 Лучшие дни</h2>
            {topDays.length > 0 ? (
              <div className="space-y-3">
                {topDays.map((day, index) => (
                  <div key={day.date} className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">
                        #{index + 1} {format(new Date(day.date), 'dd MMM yyyy', { locale: ru })}
                      </span>
                      <span className="text-xl font-bold text-green-600">{day.score?.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.planText}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Пока нет оцененных дней</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">📉 Дни для улучшения</h2>
            {worstDays.length > 0 ? (
              <div className="space-y-3">
                {worstDays.map((day, index) => (
                  <div key={day.date} className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">
                        {format(new Date(day.date), 'dd MMM yyyy', { locale: ru })}
                      </span>
                      <span className="text-xl font-bold text-red-600">{day.score?.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.planText}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Пока нет оцененных дней</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
