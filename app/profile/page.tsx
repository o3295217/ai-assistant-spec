'use client'

import { useState, useEffect } from 'react'

interface ProfileData {
  name: string
  occupation: string
  industry: string
  maritalStatus: string
  hobbies: string
  sports: string
  location: string
  age: string
  education: string
  teamSize: string
  workExperience: string
  values: string
  challenges: string
  other: string
}

interface ProfileItem {
  id: number
  blockId: number
  content: string
  order: number
  createdAt: string
  updatedAt: string
}

interface ProfileBlock {
  id: number
  title: string
  order: number
  items: ProfileItem[]
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    occupation: '',
    industry: '',
    maritalStatus: '',
    hobbies: '',
    sports: '',
    location: '',
    age: '',
    education: '',
    teamSize: '',
    workExperience: '',
    values: '',
    challenges: '',
    other: '',
  })
  const [blocks, setBlocks] = useState<ProfileBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [newBlockTitle, setNewBlockTitle] = useState('')
  const [newItemContent, setNewItemContent] = useState<{ [blockId: number]: string }>({})

  useEffect(() => {
    loadProfile()
    loadBlocks()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data) {
        setProfile({
          name: data.name || '',
          occupation: data.occupation || '',
          industry: data.industry || '',
          maritalStatus: data.maritalStatus || '',
          hobbies: data.hobbies || '',
          sports: data.sports || '',
          location: data.location || '',
          age: data.age?.toString() || '',
          education: data.education || '',
          teamSize: data.teamSize?.toString() || '',
          workExperience: data.workExperience || '',
          values: data.values || '',
          challenges: data.challenges || '',
          other: data.other || '',
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBlocks = async () => {
    try {
      const res = await fetch('/api/profile/blocks')
      const data = await res.json()
      setBlocks(data || [])
    } catch (error) {
      console.error('Error loading blocks:', error)
    }
  }

  const addBlock = async () => {
    if (!newBlockTitle.trim()) return

    try {
      const res = await fetch('/api/profile/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newBlockTitle }),
      })
      const newBlock = await res.json()
      setBlocks([...blocks, newBlock])
      setNewBlockTitle('')
      setMessage('✅ Блок добавлен')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error adding block:', error)
      setMessage('❌ Ошибка при добавлении блока')
    }
  }

  const deleteBlock = async (blockId: number) => {
    if (!confirm('Удалить этот блок и все его пункты?')) return

    try {
      await fetch(`/api/profile/blocks?id=${blockId}`, { method: 'DELETE' })
      setBlocks(blocks.filter((b) => b.id !== blockId))
      setMessage('✅ Блок удален')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error deleting block:', error)
      setMessage('❌ Ошибка при удалении блока')
    }
  }

  const addItem = async (blockId: number) => {
    const content = newItemContent[blockId]
    if (!content?.trim()) return

    try {
      const res = await fetch('/api/profile/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId, content }),
      })
      const newItem = await res.json()

      setBlocks(
        blocks.map((block) =>
          block.id === blockId ? { ...block, items: [...block.items, newItem] } : block
        )
      )
      setNewItemContent({ ...newItemContent, [blockId]: '' })
      setMessage('✅ Пункт добавлен')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error adding item:', error)
      setMessage('❌ Ошибка при добавлении пункта')
    }
  }

  const deleteItem = async (blockId: number, itemId: number) => {
    try {
      await fetch(`/api/profile/items?id=${itemId}`, { method: 'DELETE' })
      setBlocks(
        blocks.map((block) =>
          block.id === blockId ? { ...block, items: block.items.filter((i) => i.id !== itemId) } : block
        )
      )
      setMessage('✅ Пункт удален')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error deleting item:', error)
      setMessage('❌ Ошибка при удалении пункта')
    }
  }

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')

    try {
      const payload = {
        ...profile,
        age: profile.age ? parseInt(profile.age) : null,
        teamSize: profile.teamSize ? parseInt(profile.teamSize) : null,
      }

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      setMessage('✅ Профиль сохранен успешно!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <p className="text-gray-600 mt-2">
          Заполните информацию о себе, чтобы ИИ лучше понимал вашу личность и давал персонализированные рекомендации
        </p>
      </div>

      <div className="card">
        <div className="space-y-6">
          {/* Основная информация */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Основная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Имя</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input"
                  placeholder="Ваше имя"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Возраст</span>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="input"
                  placeholder="Возраст"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Где живу</span>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input"
                  placeholder="Город, страна"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Семейное положение</span>
                <input
                  type="text"
                  value={profile.maritalStatus}
                  onChange={(e) => handleChange('maritalStatus', e.target.value)}
                  className="input"
                  placeholder="Например: женат/замужем, холост/не замужем, есть дети"
                />
              </label>
            </div>
          </div>

          {/* Профессиональная информация */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Профессиональная деятельность
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Должность</span>
                <input
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  className="input"
                  placeholder="Например: Генеральный директор, руководитель отдела"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Вид деятельности</span>
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="input"
                  placeholder="Например: IT, медицина, образование"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Размер команды</span>
                <input
                  type="number"
                  value={profile.teamSize}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  className="input"
                  placeholder="Количество человек в команде"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Образование</span>
                <input
                  type="text"
                  value={profile.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  className="input"
                  placeholder="Например: Высшее техническое, MBA"
                />
              </label>
            </div>

            <label className="block mt-4">
              <span className="text-gray-700 font-medium mb-2 block">Опыт работы</span>
              <textarea
                value={profile.workExperience}
                onChange={(e) => handleChange('workExperience', e.target.value)}
                className="textarea"
                placeholder="Кратко опишите ваш профессиональный путь и ключевые достижения"
                rows={3}
              />
            </label>
          </div>

          {/* Личные интересы */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Личные интересы</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Хобби</span>
                <input
                  type="text"
                  value={profile.hobbies}
                  onChange={(e) => handleChange('hobbies', e.target.value)}
                  className="input"
                  placeholder="Например: чтение, музыка, путешествия, фотография"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Спорт</span>
                <input
                  type="text"
                  value={profile.sports}
                  onChange={(e) => handleChange('sports', e.target.value)}
                  className="input"
                  placeholder="Например: бег, плавание, йога, футбол"
                />
              </label>
            </div>
          </div>

          {/* Ценности и вызовы */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Ценности и приоритеты</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Мои ценности</span>
                <textarea
                  value={profile.values}
                  onChange={(e) => handleChange('values', e.target.value)}
                  className="textarea"
                  placeholder="Что для вас важно в жизни и работе? Например: семья, профессиональный рост, здоровье, свобода"
                  rows={3}
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Текущие вызовы</span>
                <textarea
                  value={profile.challenges}
                  onChange={(e) => handleChange('challenges', e.target.value)}
                  className="textarea"
                  placeholder="С какими трудностями вы сейчас сталкиваетесь? Что хотите улучшить?"
                  rows={3}
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Дополнительная информация</span>
                <textarea
                  value={profile.other}
                  onChange={(e) => handleChange('other', e.target.value)}
                  className="textarea"
                  placeholder="Любая другая информация, которая поможет ИИ лучше понять вас"
                  rows={3}
                />
              </label>
            </div>
          </div>

          {/* Пользовательские блоки */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Дополнительные блоки</h2>
            </div>

            {/* Форма добавления нового блока */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBlock()}
                  className="input flex-1"
                  placeholder="Название нового блока (например: Навыки, Достижения)"
                />
                <button onClick={addBlock} className="btn-primary whitespace-nowrap">
                  + Добавить блок
                </button>
              </div>
            </div>

            {/* Список блоков */}
            <div className="space-y-6">
              {blocks.map((block) => (
                <div key={block.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{block.title}</h3>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Удалить блок
                    </button>
                  </div>

                  {/* Пункты блока */}
                  <div className="space-y-2 mb-3">
                    {block.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <span className="text-gray-700">{item.content}</span>
                        <button
                          onClick={() => deleteItem(block.id, item.id)}
                          className="text-red-500 hover:text-red-700 text-sm ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Форма добавления пункта */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemContent[block.id] || ''}
                      onChange={(e) =>
                        setNewItemContent({ ...newItemContent, [block.id]: e.target.value })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && addItem(block.id)}
                      className="input flex-1 text-sm"
                      placeholder="Добавить пункт..."
                    />
                    <button onClick={() => addItem(block.id)} className="btn-primary text-sm">
                      + Добавить
                    </button>
                  </div>
                </div>
              ))}

              {blocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Нет дополнительных блоков. Создайте первый блок выше.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 border-t pt-6">
          <button onClick={saveProfile} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить профиль'}
          </button>
          {message && <span className="text-sm font-medium">{message}</span>}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Почему это важно?</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>ИИ сможет давать рекомендации с учетом вашего образа жизни и приоритетов</li>
          <li>Оценки станут более персонализированными и релевантными</li>
          <li>Система будет учитывать ваш контекст при планировании задач</li>
          <li>Вы получите более точные советы по балансу работы и личной жизни</li>
        </ul>
      </div>
    </div>
  )
}
