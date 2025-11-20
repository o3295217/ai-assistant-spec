'use client'

import { useState, useEffect, use } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'

function getAlignmentStatus(text: string): 'works' | 'partial' | 'no' {
  const lower = text.toLowerCase()
  if (lower.includes('works') || lower.includes('работает')) return 'works'
  if (lower.includes('partial') || lower.includes('частично')) return 'partial'
  return 'no'
}

function getAlignmentIcon(status: 'works' | 'partial' | 'no'): string {
  switch (status) {
    case 'works':
      return '✅'
    case 'partial':
      return '⚠️'
    case 'no':
      return '❌'
  }
}

function getAlignmentColor(status: 'works' | 'partial' | 'no'): string {
  switch (status) {
    case 'works':
      return 'text-green-600'
    case 'partial':
      return 'text-yellow-600'
    case 'no':
      return 'text-red-600'
  }
}

function getScoreColor(score: number): string {
  if (score >= 7) return 'text-green-600'
  if (score >= 5) return 'text-yellow-600'
  return 'text-red-600'
}

export default function EvaluationPage({ params }: { params: Promise<{ date: string }> }) {
  const resolvedParams = use(params)
  const [dailyEntry, setDailyEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [resolvedParams.date])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/daily?date=${resolvedParams.date}`)
      const data = await res.json()
      setDailyEntry(data)
    } catch (error) {
      console.error('Error loading evaluation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  if (!dailyEntry || !dailyEntry.evaluation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Оценка не найдена</h2>
        <p className="text-gray-600 mb-6">Для этого дня еще нет оценки</p>
        <Link href="/daily" className="btn-primary">
          Создать оценку
        </Link>
      </div>
    )
  }

  const evaluation = dailyEntry.evaluation
  const date = new Date(dailyEntry.date)

  const alignments = [
    { label: 'День → Неделя', text: evaluation.alignmentDayWeek },
    { label: 'Неделя → Месяц', text: evaluation.alignmentWeekMonth },
    { label: 'Месяц → Квартал', text: evaluation.alignmentMonthQuarter },
    { label: 'Квартал → Полугодие', text: evaluation.alignmentQuarterHalf },
    { label: 'Полугодие → Год', text: evaluation.alignmentHalfYear },
    { label: 'Год → Мечта', text: evaluation.alignmentYearDream },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Оценка дня</h1>
        <Link href="/daily" className="btn-secondary">
          ← Назад
        </Link>
      </div>

      <p className="text-lg text-gray-600">{format(date, 'd MMMM yyyy, EEEE', { locale: ru })}</p>

      {/* Overall Score */}
      <div className="card text-center bg-gradient-to-r from-primary-50 to-purple-50">
        <h2 className="text-xl font-semibold mb-2">Общая оценка</h2>
        <p className={`text-6xl font-bold ${getScoreColor(evaluation.overallScore)}`}>{evaluation.overallScore}</p>
        <p className="text-gray-600 mt-1">из 10</p>
      </div>

      {/* Scores breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Стратегия</p>
          <p className={`text-3xl font-bold ${getScoreColor(evaluation.strategyScore)}`}>{evaluation.strategyScore}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Операции</p>
          <p className={`text-3xl font-bold ${getScoreColor(evaluation.operationsScore)}`}>{evaluation.operationsScore}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Команда</p>
          <p className={`text-3xl font-bold ${getScoreColor(evaluation.teamScore)}`}>{evaluation.teamScore}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 mb-1">Эффективность</p>
          <p className={`text-3xl font-bold ${getScoreColor(evaluation.efficiencyScore)}`}>{evaluation.efficiencyScore}</p>
        </div>
      </div>

      {/* Plan vs Fact */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📊 План vs Факт</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">План:</h3>
            <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded">{dailyEntry.planText}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Факт:</h3>
            <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded">{dailyEntry.factText}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Анализ:</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{evaluation.planVsFactText}</p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="card bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold mb-4 text-red-900">💬 Обратная связь</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{evaluation.feedbackText}</p>
      </div>

      {/* Alignment */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🎯 Выравнивание целей (Alignment)</h2>
        <div className="space-y-4">
          {alignments.map((alignment, i) => {
            const status = getAlignmentStatus(alignment.text)
            return (
              <div key={i} className="border-l-4 border-gray-300 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${getAlignmentColor(status)}`}>{getAlignmentIcon(status)}</span>
                  <h3 className="font-semibold">{alignment.label}</h3>
                </div>
                <p className="text-gray-700 text-sm">{alignment.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-green-50 border border-green-200">
        <h2 className="text-xl font-bold mb-4 text-green-900">💡 Рекомендации</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{evaluation.recommendationsText}</p>
      </div>
    </div>
  )
}
