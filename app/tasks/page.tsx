'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks/open')
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeTask = async (taskId: number) => {
    try {
      await fetch(`/api/tasks/${taskId}/close`, { method: 'POST' })
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (error) {
      console.error('Error closing task:', error)
    }
  }

  const strategicTasks = tasks.filter((t) => t.taskType === 'strategic')
  const operationalTasks = tasks.filter((t) => t.taskType === 'operational')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Незакрытые задачи</h1>

      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Все задачи закрыты! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategic Tasks */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-purple-700">🎯 Стратегические задачи</h2>
            {strategicTasks.length === 0 ? (
              <p className="text-gray-600 text-sm">Нет стратегических задач</p>
            ) : (
              <div className="space-y-3">
                {strategicTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-gray-800 mb-2">{task.taskText}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {format(new Date(task.originDate), 'd MMM yyyy', { locale: ru })}
                      </span>
                      <button
                        onClick={() => closeTask(task.id)}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Закрыть
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Operational Tasks */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-blue-700">⚙️ Операционные задачи</h2>
            {operationalTasks.length === 0 ? (
              <p className="text-gray-600 text-sm">Нет операционных задач</p>
            ) : (
              <div className="space-y-3">
                {operationalTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-800 mb-2">{task.taskText}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {format(new Date(task.originDate), 'd MMM yyyy', { locale: ru })}
                      </span>
                      <button
                        onClick={() => closeTask(task.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Закрыть
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
