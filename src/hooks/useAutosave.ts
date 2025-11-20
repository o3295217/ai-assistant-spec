import { useEffect, useRef } from 'react'

export function useAutosave(
  key: string,
  value: string,
  delay: number = 30000 // 30 секунд
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Загрузить сохраненное значение при монтировании
    const saved = localStorage.getItem(key)
    if (saved && !value) {
      return
    }

    // Сохранять с задержкой
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (value) {
      timeoutRef.current = setTimeout(() => {
        localStorage.setItem(key, value)
        console.log(`💾 Автосохранено: ${key}`)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [key, value, delay])

  // Функция для загрузки сохраненного значения
  const loadDraft = () => {
    return localStorage.getItem(key) || ''
  }

  // Функция для очистки черновика
  const clearDraft = () => {
    localStorage.removeItem(key)
  }

  return { loadDraft, clearDraft }
}
