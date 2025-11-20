import { useEffect, useState } from 'react'
import { Card } from './ui/Card'

export function StreakWidget() {
  const [streak, setStreak] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreak()
  }, [])

  const fetchStreak = async () => {
    try {
      const res = await fetch('/api/analytics/streak')
      const data = await res.json()
      setStreak(data)
    } catch (error) {
      console.error('Error fetching streak:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Card className="animate-pulse">
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </Card>
  }

  if (!streak) return null

  return (
    <Card hover className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Текущая серия</div>
          <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
            {streak.currentStreak} 🔥
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {streak.currentStreak === 0 ? 'Начните заполнять дни!' : `Продолжайте в том же духе!`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Рекорд</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {streak.longestStreak} дней
          </div>
        </div>
      </div>
    </Card>
  )
}
