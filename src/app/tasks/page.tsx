'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Task {
  id: number
  taskText: string
  taskType: 'strategic' | 'operational'
  originDate: string
  isClosed: boolean
  closedAt: string | null
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showClosed, setShowClosed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskType, setNewTaskType] = useState<'strategic' | 'operational'>('strategic')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadTasks()
  }, [showClosed])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks?includeClosed=${showClosed}`)
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!newTaskText.trim()) {
      setMessage('Введите текст задачи')
      return
    }

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskText: newTaskText,
          taskType: newTaskType,
          originDate: new Date().toISOString(),
        }),
      })

      setNewTaskText('')
      setMessage('Задача создана!')
      setTimeout(() => setMessage(''), 3000)
      loadTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      setMessage('Ошибка при создании задачи')
    }
  }

  const closeTask = async (taskId: number) => {
    try {
      await fetch(`/api/tasks/${taskId}/close`, {
        method: 'POST',
      })
      loadTasks()
    } catch (error) {
      console.error('Error closing task:', error)
    }
  }

  const openTasks = tasks.filter(t => !t.isClosed)
  const strategicTasks = openTasks.filter(t => t.taskType === 'strategic')
  const operationalTasks = openTasks.filter(t => t.taskType === 'operational')
  const closedTasks = tasks.filter(t => t.isClosed)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Незакрытые задачи</h1>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{openTasks.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Открытых задач</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{strategicTasks.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Стратегических</div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{operationalTasks.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Операционных</div>
          </div>
        </div>

        {/* Создание новой задачи */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Добавить задачу</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Текст задачи</label>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Описание задачи..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип задачи</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="strategic"
                    checked={newTaskType === 'strategic'}
                    onChange={(e) => setNewTaskType(e.target.value as 'strategic')}
                    className="mr-2"
                  />
                  Стратегическая
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="operational"
                    checked={newTaskType === 'operational'}
                    onChange={(e) => setNewTaskType(e.target.value as 'operational')}
                    className="mr-2"
                  />
                  Операционная
                </label>
              </div>
            </div>
            <button
              onClick={createTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Добавить задачу
            </button>
            {message && (
              <span className={`text-sm ml-4 ${message.includes('Ошибка') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </span>
            )}
          </div>
        </div>

        {/* Переключатель показа закрытых задач */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Показать закрытые задачи</span>
          </label>
        </div>

        {/* Стратегические задачи */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🎯 Стратегические задачи</h2>
          {strategicTasks.length > 0 ? (
            <div className="space-y-3">
              {strategicTasks.map((task) => (
                <div key={task.id} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{task.taskText}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Создана: {format(new Date(task.originDate), 'dd MMM yyyy', { locale: ru })}
                    </p>
                  </div>
                  <button
                    onClick={() => closeTask(task.id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Закрыть
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Нет открытых стратегических задач</p>
          )}
        </div>

        {/* Операционные задачи */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">⚙️ Операционные задачи</h2>
          {operationalTasks.length > 0 ? (
            <div className="space-y-3">
              {operationalTasks.map((task) => (
                <div key={task.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{task.taskText}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Создана: {format(new Date(task.originDate), 'dd MMM yyyy', { locale: ru })}
                    </p>
                  </div>
                  <button
                    onClick={() => closeTask(task.id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Закрыть
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Нет открытых операционных задач</p>
          )}
        </div>

        {/* Закрытые задачи */}
        {showClosed && closedTasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">✅ Закрытые задачи</h2>
            <div className="space-y-3">
              {closedTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-60">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium line-through">{task.taskText}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className={task.taskType === 'strategic' ? 'text-purple-600' : 'text-orange-600'}>
                          {task.taskType === 'strategic' ? '🎯 Стратегическая' : '⚙️ Операционная'}
                        </span>
                        {' • '}
                        Закрыта: {task.closedAt ? format(new Date(task.closedAt), 'dd MMM yyyy', { locale: ru }) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
