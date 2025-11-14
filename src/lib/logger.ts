// Утилита для логирования в файл
import fs from 'fs'
import path from 'path'

const LOG_FILE = path.join(process.cwd(), 'logs', 'app.log')

// Создаем директорию logs если её нет
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export function logToFile(level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    data: data || undefined,
  }

  const logLine = JSON.stringify(logEntry) + '\n'

  // Асинхронная запись в файл
  fs.appendFile(LOG_FILE, logLine, (err) => {
    if (err) console.error('Failed to write log:', err)
  })

  // Дублируем в консоль
  console.log(`[${level}] ${message}`, data || '')
}

// Удобные методы
export const logger = {
  info: (message: string, data?: any) => logToFile('INFO', message, data),
  warn: (message: string, data?: any) => logToFile('WARN', message, data),
  error: (message: string, data?: any) => logToFile('ERROR', message, data),
}
