'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    loadTrendData()
  }, [days])

  const loadTrendData = async () => {
    try {
      const res = await fetch(`/api/analytics/trend?days=${days}`)
      const data = await res.json()
      setTrendData(data)
    } catch (error) {
      console.error('Error loading trend data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (trendData.length === 0) return null

    const scores = trendData.map((d) => d.overallScore).filter((s) => s > 0)
    if (scores.length === 0) return null

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const max = Math.max(...scores)
    const min = Math.min(...scores)

    const sorted = [...trendData]
      .filter((d) => d.overallScore > 0)
      .sort((a, b) => b.overallScore - a.overallScore)

    const topDays = sorted.slice(0, 3)
    const worstDays = sorted.slice(-3).reverse()

    return { avg, max, min, topDays, worstDays }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="input w-auto">
          <option value={7}>7 дней</option>
          <option value={30}>30 дней</option>
          <option value={60}>60 дней</option>
          <option value={90}>90 дней</option>
        </select>
      </div>

      {!stats ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Недостаточно данных для анализа</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-sm text-gray-600 mb-1">Средняя оценка</p>
              <p className="text-4xl font-bold text-primary-600">{stats.avg.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600 mb-1">Максимальная</p>
              <p className="text-4xl font-bold text-green-600">{stats.max.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600 mb-1">Минимальная</p>
              <p className="text-4xl font-bold text-red-600">{stats.min.toFixed(1)}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">График оценок</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="overallScore" stroke="#0ea5e9" name="Общая оценка" strokeWidth={2} />
                <Line type="monotone" dataKey="strategyScore" stroke="#8b5cf6" name="Стратегия" />
                <Line type="monotone" dataKey="operationsScore" stroke="#10b981" name="Операции" />
                <Line type="monotone" dataKey="teamScore" stroke="#f59e0b" name="Команда" />
                <Line type="monotone" dataKey="efficiencyScore" stroke="#ef4444" name="Эффективность" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top and Worst Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 text-green-700">🏆 Лучшие дни</h2>
              <div className="space-y-2">
                {stats.topDays.map((day: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">{day.date}</span>
                    <span className="font-bold text-green-700">{day.overallScore}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4 text-red-700">📉 Худшие дни</h2>
              <div className="space-y-2">
                {stats.worstDays.map((day: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm">{day.date}</span>
                    <span className="font-bold text-red-700">{day.overallScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
