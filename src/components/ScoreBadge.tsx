interface ScoreBadgeProps {
  score: number
  label: string
  trend?: 'up' | 'down' | 'stable'
}

export function ScoreBadge({ score, label, trend }: ScoreBadgeProps) {
  const trendIcon = trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score}</span>
        {trend && <span className={`text-2xl ${trendColor}`}>{trendIcon}</span>}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</div>
    </div>
  )
}
