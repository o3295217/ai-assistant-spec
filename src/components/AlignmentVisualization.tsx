'use client'

interface AlignmentVisualizationProps {
  alignmentDayWeek: string
  alignmentWeekMonth: string
  alignmentMonthQuarter: string
  alignmentQuarterHalf: string
  alignmentHalfYear: string
  alignmentYearDream: string
}

interface AlignmentItem {
  from: string
  to: string
  text: string
  status: 'works' | 'partial' | 'no'
}

export default function AlignmentVisualization({
  alignmentDayWeek,
  alignmentWeekMonth,
  alignmentMonthQuarter,
  alignmentQuarterHalf,
  alignmentHalfYear,
  alignmentYearDream,
}: AlignmentVisualizationProps) {
  const parseStatus = (text: string): 'works' | 'partial' | 'no' => {
    const lower = text.toLowerCase()
    if (lower.includes('works') || lower.includes('работает')) return 'works'
    if (lower.includes('partial') || lower.includes('частично')) return 'partial'
    return 'no'
  }

  const alignments: AlignmentItem[] = [
    { from: 'День', to: 'Неделя', text: alignmentDayWeek, status: parseStatus(alignmentDayWeek) },
    { from: 'Неделя', to: 'Месяц', text: alignmentWeekMonth, status: parseStatus(alignmentWeekMonth) },
    { from: 'Месяц', to: 'Квартал', text: alignmentMonthQuarter, status: parseStatus(alignmentMonthQuarter) },
    { from: 'Квартал', to: 'Полугодие', text: alignmentQuarterHalf, status: parseStatus(alignmentQuarterHalf) },
    { from: 'Полугодие', to: 'Год', text: alignmentHalfYear, status: parseStatus(alignmentHalfYear) },
    { from: 'Год', to: 'Мечта', text: alignmentYearDream, status: parseStatus(alignmentYearDream) },
  ]

  const getStatusIcon = (status: 'works' | 'partial' | 'no') => {
    switch (status) {
      case 'works':
        return '✅'
      case 'partial':
        return '⚠️'
      case 'no':
        return '❌'
    }
  }

  const getStatusColor = (status: 'works' | 'partial' | 'no') => {
    switch (status) {
      case 'works':
        return 'bg-green-50 dark:bg-green-900/20 border-green-300'
      case 'partial':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300'
      case 'no':
        return 'bg-red-50 dark:bg-red-900/20 border-red-300'
    }
  }

  const getConnectorColor = (status: 'works' | 'partial' | 'no') => {
    switch (status) {
      case 'works':
        return 'border-green-500'
      case 'partial':
        return 'border-yellow-500'
      case 'no':
        return 'border-red-500'
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Выравнивание целей (Alignment)</h3>

      {/* Визуальная цепочка */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
        {alignments.map((alignment, index) => (
          <div key={index} className="flex items-center">
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm font-medium">
              {alignment.from}
            </div>
            <div className={`w-8 h-0 border-t-2 ${getConnectorColor(alignment.status)} mx-1`}></div>
            {index === alignments.length - 1 && (
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm font-medium">
                {alignment.to}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Детали по каждому уровню */}
      <div className="space-y-3">
        {alignments.map((alignment, index) => (
          <details key={index} className={`border rounded-lg ${getStatusColor(alignment.status)}`}>
            <summary className="cursor-pointer p-4 font-medium flex items-center gap-2">
              <span>{getStatusIcon(alignment.status)}</span>
              <span>{alignment.from} → {alignment.to}</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {alignment.text}
            </div>
          </details>
        ))}
      </div>

      {/* Общая оценка выравнивания */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold mb-2">Общая оценка выравнивания</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-green-600">✅ Работает: </span>
            <span className="font-semibold">{alignments.filter(a => a.status === 'works').length}</span>
          </div>
          <div>
            <span className="text-yellow-600">⚠️ Частично: </span>
            <span className="font-semibold">{alignments.filter(a => a.status === 'partial').length}</span>
          </div>
          <div>
            <span className="text-red-600">❌ Не работает: </span>
            <span className="font-semibold">{alignments.filter(a => a.status === 'no').length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
