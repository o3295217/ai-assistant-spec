import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'

/**
 * GET /api/analytics/trend?days=30
 * Получить данные для графика тренда за последние N дней
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam) : 30

    const startDate = subDays(new Date(), days)

    const entries = await prisma.dailyEntry.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      include: {
        evaluation: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Формируем данные для графика
    const trendData = entries.map(entry => ({
      date: entry.date,
      overall: entry.evaluation?.overallScore || null,
      strategy: entry.evaluation?.strategyScore || null,
      operations: entry.evaluation?.operationsScore || null,
      team: entry.evaluation?.teamScore || null,
      efficiency: entry.evaluation?.efficiencyScore || null,
    }))

    // Вычисляем статистику
    const evaluatedEntries = entries.filter(e => e.evaluation)
    const stats = {
      totalDays: entries.length,
      evaluatedDays: evaluatedEntries.length,
      averageScore: evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((sum, e) => sum + (e.evaluation?.overallScore || 0), 0) / evaluatedEntries.length
        : 0,
      maxScore: evaluatedEntries.length > 0
        ? Math.max(...evaluatedEntries.map(e => e.evaluation?.overallScore || 0))
        : 0,
      minScore: evaluatedEntries.length > 0
        ? Math.min(...evaluatedEntries.map(e => e.evaluation?.overallScore || 0))
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

    // Находим лучшие и худшие дни
    const sortedByScore = [...evaluatedEntries].sort((a, b) =>
      (b.evaluation?.overallScore || 0) - (a.evaluation?.overallScore || 0)
    )

    const topDays = sortedByScore.slice(0, 3).map(e => ({
      date: e.date,
      score: e.evaluation?.overallScore,
      planText: e.planText?.substring(0, 100),
    }))

    const worstDays = sortedByScore.slice(-3).reverse().map(e => ({
      date: e.date,
      score: e.evaluation?.overallScore,
      planText: e.planText?.substring(0, 100),
    }))

    return NextResponse.json({
      trendData,
      stats,
      topDays,
      worstDays,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
