'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function HomePage() {
  const [today] = useState(new Date())
  const [dreamGoal, setDreamGoal] = useState<any>(null)
  const [dailyEntry, setDailyEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch dream goal
      const dreamRes = await fetch('/api/goals/dream')
      const dream = await dreamRes.json()
      setDreamGoal(dream)

      // Fetch today's entry
      const dateStr = format(today, 'yyyy-MM-dd')
      const dailyRes = await fetch(`/api/daily?date=${dateStr}`)
      const daily = await dailyRes.json()
      setDailyEntry(daily)
    } catch (error) {
      console.error('Error fetching data:', error)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Добро пожаловать!</h1>
        <p className="text-lg text-gray-600">{format(today, 'd MMMM yyyy, EEEE', { locale: ru })}</p>
      </div>

      {/* Today's Card */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Сегодняшний день</h2>
        <div className="space-y-4">
          {!dailyEntry?.planText && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">План на сегодня еще не создан</p>
              <Link href="/daily" className="btn-primary mt-2 inline-block">
                Создать план
              </Link>
            </div>
          )}

          {dailyEntry?.planText && !dailyEntry?.factText && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 mb-2">План на сегодня создан</p>
              <Link href="/daily" className="btn-primary inline-block">
                Добавить факт выполнения
              </Link>
            </div>
          )}

          {dailyEntry?.factText && !dailyEntry?.evaluation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 mb-2">План и факт заполнены</p>
              <Link href="/daily" className="btn-primary inline-block">
                Получить оценку
              </Link>
            </div>
          )}

          {dailyEntry?.evaluation && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 mb-2">
                Оценка за сегодня: <span className="font-bold text-2xl">{dailyEntry.evaluation.overallScore}</span>/10
              </p>
              <Link href={`/evaluation/${format(today, 'yyyy-MM-dd')}`} className="btn-primary inline-block">
                Посмотреть детали
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dream Goal */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">🎯 Ваша мечта (5 лет)</h2>
        {dreamGoal?.goalText ? (
          <div>
            <p className="text-lg text-gray-800 mb-4">{dreamGoal.goalText}</p>
            <Link href="/goals" className="text-primary-600 hover:underline">
              Редактировать цели
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Мечта еще не установлена</p>
            <Link href="/goals" className="btn-primary inline-block">
              Создать мечту
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/daily" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">📝 Ежедневное планирование</h3>
          <p className="text-gray-600">Создайте план на день и добавьте факт выполнения</p>
        </Link>

        <Link href="/goals" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">🎯 Управление целями</h3>
          <p className="text-gray-600">Установите цели на неделю, месяц, квартал и год</p>
        </Link>

        <Link href="/analytics" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">📊 Аналитика</h3>
          <p className="text-gray-600">Просмотрите статистику и тренды вашей эффективности</p>
        </Link>
      </div>
    </div>
  )
}
