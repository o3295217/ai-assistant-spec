import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { getPeriodDates } from '@/lib/periods'

/**
 * GET /api/analytics/week-report?date=2025-11-10
 * Получить отчет за неделю
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')
    const date = dateStr ? new Date(dateStr) : new Date()

    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

    // Получаем цели недели
    const weekPeriod = getPeriodDates(date, 'week')
    const weekGoals = await prisma.periodGoals.findFirst({
      where: {
        periodType: 'week',
        periodStart: weekPeriod.start,
        periodEnd: weekPeriod.end,
      },
    })

    // Получаем записи за неделю
    const entries = await prisma.dailyEntry.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        evaluation: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Вычисляем статистику
    const evaluatedEntries = entries.filter(e => e.evaluation)

    const weekStats = {
      totalDays: entries.length,
      evaluatedDays: evaluatedEntries.length,
      plannedDays: entries.filter(e => e.planText).length,
      completedDays: entries.filter(e => e.factText).length,
      averageScore: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.overallScore || 0), 0) / evaluatedEntries.length
        : 0,
      averageStrategy: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.strategyScore || 0), 0) / evaluatedEntries.length
        : 0,
      averageOperations: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.operationsScore || 0), 0) / evaluatedEntries.length
        : 0,
      averageTeam: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.teamScore || 0), 0) / evaluatedEntries.length
        : 0,
      averageEfficiency: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.efficiencyScore || 0), 0) / evaluatedEntries.length
        : 0,
    }

    // Данные по дням для графика
    const dailyData = entries.map(entry => ({
      date: format(new Date(entry.date), 'EEE', { locale: ru }),
      fullDate: entry.date,
      score: entry.evaluation?.overallScore || null,
      hasEvaluation: !!entry.evaluation,
    }))

    return NextResponse.json({
      weekPeriod: {
        start: weekStart,
        end: weekEnd,
        label: `Неделя ${format(weekStart, 'd MMM', { locale: ru })} - ${format(weekEnd, 'd MMM yyyy', { locale: ru })}`,
      },
      weekGoals: weekGoals ? JSON.parse(weekGoals.goalsJson) : [],
      weekStats,
      dailyData,
      entries,
    })
  } catch (error) {
    console.error('Error fetching week report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch week report' },
      { status: 500 }
    )
  }
}
