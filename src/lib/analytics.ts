import { prisma } from './prisma'

export async function calculateStreak(userId: number = 1) {
  // Получить все дни с записями, отсортированные по дате
  const entries = await prisma.dailyEntry.findMany({
    where: {
      planText: { not: null },
      factText: { not: null }
    },
    orderBy: { date: 'desc' }
  })

  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastEntryDate: null }
  }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastEntry = new Date(parseInt(entries[0].date.toString()))
  lastEntry.setHours(0, 0, 0, 0)

  // Проверить текущую серию
  const daysDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff === 0 || daysDiff === 1) {
    currentStreak = 1
    
    // Подсчитать текущую серию
    for (let i = 1; i < entries.length; i++) {
      const prevDate = new Date(parseInt(entries[i-1].date.toString()))
      const currDate = new Date(parseInt(entries[i].date.toString()))
      prevDate.setHours(0, 0, 0, 0)
      currDate.setHours(0, 0, 0, 0)
      
      const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diff === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Найти самую длинную серию
  for (let i = 1; i < entries.length; i++) {
    const prevDate = new Date(parseInt(entries[i-1].date.toString()))
    const currDate = new Date(parseInt(entries[i].date.toString()))
    prevDate.setHours(0, 0, 0, 0)
    currDate.setHours(0, 0, 0, 0)
    
    const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diff === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, tempStreak)

  return {
    currentStreak,
    longestStreak,
    lastEntryDate: entries[0].date
  }
}

export async function getScoreTrend(days: number = 7) {
  const entries = await prisma.dailyEntry.findMany({
    take: days,
    orderBy: { date: 'desc' },
    include: { evaluation: true }
  })

  if (entries.length === 0) return null

  const scores = entries
    .filter((e: any) => e.evaluation)
    .map((e: any) => e.evaluation!.overallScore)

  const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
  const currentScore = entries[0]?.evaluation?.overallScore || 0

  return {
    current: currentScore,
    average: avgScore,
    trend: currentScore > avgScore ? 'up' : currentScore < avgScore ? 'down' : 'stable',
    trendIcon: currentScore > avgScore ? '↗️' : currentScore < avgScore ? '↘️' : '→'
  }
}
