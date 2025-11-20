'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Criteria {
  id: number
  key: string
  nameRu: string
  category: string
  description?: string
}

export default function CriteriaSelectionPage() {
  const router = useRouter()
  const [allCriteria, setAllCriteria] = useState<Record<string, Criteria[]>>({})
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCriteria()
  }, [])

  const loadCriteria = async () => {
    try {
      // Load all criteria
      const allRes = await fetch('/api/criteria')
      const allData = await allRes.json()
      setAllCriteria(allData.byCategory)

      // Load selected criteria
      const selectedRes = await fetch('/api/criteria/selected')
      const selectedData = await selectedRes.json()
      setSelectedIds(selectedData.map((c: Criteria) => c.id))
    } catch (error) {
      console.error('Error loading criteria:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCriteria = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const saveCriteria = async () => {
    if (selectedIds.length === 0) {
      alert('Выберите хотя бы один критерий!')
      return
    }

    setSaving(true)
    try {
      await fetch('/api/criteria/selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteriaIds: selectedIds })
      })
      router.push('/profile')
    } catch (error) {
      console.error('Error saving criteria:', error)
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const categoryNames: Record<string, string> = {
    work: '💼 Работа',
    personal: '❤️ Личная жизнь',
    development: '📚 Развитие',
    health: '🏃 Здоровье',
    achievements: '🏆 Достижения'
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Выбор критериев оценки</h1>
      <p className="text-gray-600">
        Выберите критерии, по которым ИИ будет оценивать ваш день. Выбрано: {selectedIds.length}
      </p>

      <div className="space-y-6">
        {Object.entries(allCriteria).map(([category, criteria]) => (
          <div key={category} className="card">
            <h3 className="text-xl font-bold mb-4">{categoryNames[category] || category}</h3>
            <div className="space-y-2">
              {criteria.map((c) => (
                <label key={c.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleCriteria(c.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{c.nameRu}</div>
                    {c.description && (
                      <div className="text-sm text-gray-600">{c.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={saveCriteria}
          disabled={saving || selectedIds.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить выбор'}
        </button>
        <button onClick={() => router.back()} className="btn-secondary">
          Отмена
        </button>
      </div>
    </div>
  )
}
