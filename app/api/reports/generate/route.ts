import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluatePeriod, PeriodReportRequest, DayData } from '@/lib/anthropic'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { periodType, startDate, endDate } = body

    if (!periodType || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Получаем все дни с планами и оценками за период
    const dailyEntries = await prisma.dailyEntry.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        evaluation: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    if (dailyEntries.length === 0) {
      return NextResponse.json({ error: 'No data found for this period' }, { status: 404 })
    }

    // Получаем профиль пользователя
    const userProfile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    // Получаем мечту
    const dream = await prisma.dreamGoal.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    // Получаем цели периода (недельные или месячные в зависимости от типа)
    let periodGoals: string[] = []
    if (periodType === 'week') {
      const weekGoal = await prisma.periodGoal.findFirst({
        where: {
          periodType: 'week',
          periodStart: { lte: start },
          periodEnd: { gte: end },
        },
        orderBy: { createdAt: 'desc' },
      })
      if (weekGoal) {
        periodGoals = JSON.parse(weekGoal.goalsJson)
      }
    } else if (periodType === 'month') {
      const monthGoal = await prisma.periodGoal.findFirst({
        where: {
          periodType: 'month',
          periodStart: { lte: start },
          periodEnd: { gte: end },
        },
        orderBy: { createdAt: 'desc' },
      })
      if (monthGoal) {
        periodGoals = JSON.parse(monthGoal.goalsJson)
      }
    }

    // Формируем данные для AI
    const days: DayData[] = dailyEntries.map((entry) => ({
      date: format(entry.date, 'yyyy-MM-dd'),
      planText: entry.planText || '',
      factText: entry.factText || '',
      evaluation: entry.evaluation
        ? {
            strategyScore: entry.evaluation.strategyScore,
            operationsScore: entry.evaluation.operationsScore,
            teamScore: entry.evaluation.teamScore,
            efficiencyScore: entry.evaluation.efficiencyScore,
            overallScore: entry.evaluation.overallScore,
            feedbackText: entry.evaluation.feedbackText,
          }
        : undefined,
    }))

    const reportRequest: PeriodReportRequest = {
      periodType,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      days,
      userProfile: userProfile
        ? {
            name: userProfile.name || undefined,
            occupation: userProfile.occupation || undefined,
            industry: userProfile.industry || undefined,
          }
        : undefined,
      dreamGoal: dream?.goalText,
      periodGoals,
    }

    // Вызываем AI для анализа
    const aiReport = await evaluatePeriod(reportRequest)

    // Считаем статистику
    const daysWithEvaluation = days.filter((d) => d.evaluation)
    const avgScores = {
      overall: 0,
      strategy: 0,
      operations: 0,
      team: 0,
      efficiency: 0,
    }

    if (daysWithEvaluation.length > 0) {
      daysWithEvaluation.forEach((day) => {
        if (day.evaluation) {
          avgScores.overall += day.evaluation.overallScore
          avgScores.strategy += day.evaluation.strategyScore
          avgScores.operations += day.evaluation.operationsScore
          avgScores.team += day.evaluation.teamScore
          avgScores.efficiency += day.evaluation.efficiencyScore
        }
      })

      avgScores.overall = Math.round((avgScores.overall / daysWithEvaluation.length) * 10) / 10
      avgScores.strategy = Math.round((avgScores.strategy / daysWithEvaluation.length) * 10) / 10
      avgScores.operations = Math.round((avgScores.operations / daysWithEvaluation.length) * 10) / 10
      avgScores.team = Math.round((avgScores.team / daysWithEvaluation.length) * 10) / 10
      avgScores.efficiency = Math.round((avgScores.efficiency / daysWithEvaluation.length) * 10) / 10
    }

    // Сохраняем отчет в БД
    const report = await prisma.periodReport.create({
      data: {
        periodType,
        startDate: start,
        endDate: end,
        daysCount: days.length,
        daysEvaluated: daysWithEvaluation.length,
        avgOverallScore: avgScores.overall || null,
        avgStrategyScore: avgScores.strategy || null,
        avgOperationsScore: avgScores.operations || null,
        avgTeamScore: avgScores.team || null,
        avgEfficiencyScore: avgScores.efficiency || null,
        aiSummary: aiReport.summary,
        aiAchievements: aiReport.achievements,
        aiChallenges: aiReport.challenges,
        aiRecommendations: aiReport.recommendations,
        trends: JSON.stringify(aiReport.trends),
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
