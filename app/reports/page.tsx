'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns'
import { ru } from 'date-fns/locale'

interface PeriodReport {
  id: number
  periodType: string
  startDate: string
  endDate: string
  daysCount: number
  daysEvaluated: number
  avgOverallScore: number | null
  avgStrategyScore: number | null
  avgOperationsScore: number | null
  avgTeamScore: number | null
  avgEfficiencyScore: number | null
  aiSummary: string
  aiAchievements: string
  aiChallenges: string
  aiRecommendations: string
  trends: string | null
  createdAt: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<PeriodReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState<PeriodReport | null>(null)
  const [message, setMessage] = useState('')

  // Форма создания отчета
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'quarter' | 'custom'>('week')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadReports()
    setDefaultDates()
  }, [])

  useEffect(() => {
    setDefaultDates()
  }, [periodType])

  const setDefaultDates = () => {
    const today = new Date()
    let start: Date
    let end: Date

    switch (periodType) {
      case 'week':
        start = startOfWeek(today, { weekStartsOn: 1 })
        end = endOfWeek(today, { weekStartsOn: 1 })
        break
      case 'month':
        start = startOfMonth(today)
        end = endOfMonth(today)
        break
      case 'quarter':
        start = startOfQuarter(today)
        end = endOfQuarter(today)
        break
      default:
        start = startOfWeek(today, { weekStartsOn: 1 })
        end = today
    }

    setStartDate(format(start, 'yyyy-MM-dd'))
    setEndDate(format(end, 'yyyy-MM-dd'))
  }

  const loadReports = async () => {
    try {
      const res = await fetch('/api/reports')
      const data = await res.json()
      setReports(data)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setGenerating(true)
    setMessage('⏳ Генерация отчета...')

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodType,
          startDate,
          endDate,
        }),
      })

      if (res.ok) {
        const newReport = await res.json()
        setReports([newReport, ...reports])
        setSelectedReport(newReport)
        setMessage('✅ Отчет сгенерирован!')
      } else {
        const error = await res.json()
        setMessage(`❌ Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      setMessage('❌ Ошибка при генерации отчета')
    } finally {
      setGenerating(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const periodTypeLabels = {
    week: 'Неделя',
    month: 'Месяц',
    quarter: 'Квартал',
    custom: 'Произвольный период',
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Отчеты за период</h1>

      {/* Генерация нового отчета */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <h2 className="text-xl font-bold mb-4">📊 Создать новый отчет</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тип периода</label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="input"
            >
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="quarter">Квартал</option>
              <option value="custom">Произвольный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Начало периода</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Конец периода</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
          </div>
        </div>

        <button onClick={generateReport} disabled={generating} className="btn-primary disabled:opacity-50">
          {generating ? 'Генерация отчета...' : 'Сгенерировать отчет с AI-анализом'}
        </button>

        {message && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>

      {/* Детали выбранного отчета */}
      {selectedReport && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {periodTypeLabels[selectedReport.periodType as keyof typeof periodTypeLabels]}
            </h2>
            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">
              ✕ Закрыть
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              {format(new Date(selectedReport.startDate), 'd MMMM yyyy', { locale: ru })} -{' '}
              {format(new Date(selectedReport.endDate), 'd MMMM yyyy', { locale: ru })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Дней в периоде: {selectedReport.daysCount} | Оценено: {selectedReport.daysEvaluated}
            </p>
          </div>

          {/* Средние оценки */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Общая</p>
              <p className="text-2xl font-bold text-purple-700">
                {selectedReport.avgOverallScore?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Стратегия</p>
              <p className="text-2xl font-bold text-blue-700">
                {selectedReport.avgStrategyScore?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Операции</p>
              <p className="text-2xl font-bold text-green-700">
                {selectedReport.avgOperationsScore?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Команда</p>
              <p className="text-2xl font-bold text-yellow-700">
                {selectedReport.avgTeamScore?.toFixed(1) || '-'}
              </p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Эффективность</p>
              <p className="text-2xl font-bold text-red-700">
                {selectedReport.avgEfficiencyScore?.toFixed(1) || '-'}
              </p>
            </div>
          </div>

          {/* Тренды */}
          {selectedReport.trends && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">📊 Тренды</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(JSON.parse(selectedReport.trends)).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendIcon(value as string)}</span>
                    <span className="text-sm text-gray-700 capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Анализ */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">📝 Резюме</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.aiSummary}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-700">🏆 Достижения</h3>
              <div className="text-gray-700 whitespace-pre-wrap bg-green-50 p-4 rounded-lg">
                {selectedReport.aiAchievements}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-orange-700">⚠️ Проблемы и вызовы</h3>
              <div className="text-gray-700 whitespace-pre-wrap bg-orange-50 p-4 rounded-lg">
                {selectedReport.aiChallenges}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-700">💡 Рекомендации</h3>
              <div className="text-gray-700 whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">
                {selectedReport.aiRecommendations}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Список всех отчетов */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">История отчетов</h2>

        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Отчеты еще не созданы</p>
            <p className="text-sm mt-2">Создайте первый отчет выше</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {periodTypeLabels[report.periodType as keyof typeof periodTypeLabels]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(report.startDate), 'd MMM', { locale: ru })} -{' '}
                      {format(new Date(report.endDate), 'd MMM yyyy', { locale: ru })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.daysEvaluated}/{report.daysCount} дней оценено
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {report.avgOverallScore?.toFixed(1) || '-'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(report.createdAt), 'd MMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
