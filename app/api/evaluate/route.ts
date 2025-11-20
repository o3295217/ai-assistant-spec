import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateDay, EvaluationRequest } from '@/lib/anthropic'
import { getPeriodDates } from '@/lib/dates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dailyEntryId } = body

    if (!dailyEntryId) {
      return NextResponse.json({ error: 'dailyEntryId is required' }, { status: 400 })
    }

    // Get daily entry
    const dailyEntry = await prisma.dailyEntry.findUnique({
      where: { id: dailyEntryId },
    })

    if (!dailyEntry) {
      return NextResponse.json({ error: 'Daily entry not found' }, { status: 404 })
    }

    if (!dailyEntry.factText) {
      return NextResponse.json({ error: 'Fact text is required for evaluation' }, { status: 400 })
    }

    // Get dream goal
    const dream = await prisma.dreamGoal.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    // Get all period goals
    const date = dailyEntry.date
    const yearPeriod = getPeriodDates(date, 'year')
    const halfYearPeriod = getPeriodDates(date, 'half_year')
    const quarterPeriod = getPeriodDates(date, 'quarter')
    const monthPeriod = getPeriodDates(date, 'month')
    const weekPeriod = getPeriodDates(date, 'week')

    const [yearGoals, halfYearGoals, quarterGoals, monthGoals, weekGoals] = await Promise.all([
      prisma.periodGoal.findFirst({
        where: { periodType: 'year', periodStart: yearPeriod.start },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.periodGoal.findFirst({
        where: { periodType: 'half_year', periodStart: halfYearPeriod.start },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.periodGoal.findFirst({
        where: { periodType: 'quarter', periodStart: quarterPeriod.start },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.periodGoal.findFirst({
        where: { periodType: 'month', periodStart: monthPeriod.start },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.periodGoal.findFirst({
        where: { periodType: 'week', periodStart: weekPeriod.start },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Get open tasks
    const openTasks = await prisma.openTask.findMany({
      where: { isClosed: false },
    })

    // Get user profile
    const userProfile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    // Get selected criteria
    const selectedCriteria = await prisma.userSelectedCriteria.findMany({
      where: {
        userId: 1, // Single-user app
        isEnabled: true
      },
      include: {
        criteria: true
      },
      orderBy: { order: 'asc' }
    })

    // Prepare evaluation request
    const evaluationRequest: EvaluationRequest = {
      dreamGoal: dream?.goalText || 'Не указана',
      yearGoals: yearGoals ? JSON.parse(yearGoals.goalsJson) : [],
      halfYearGoals: halfYearGoals ? JSON.parse(halfYearGoals.goalsJson) : [],
      quarterGoals: quarterGoals ? JSON.parse(quarterGoals.goalsJson) : [],
      monthGoals: monthGoals ? JSON.parse(monthGoals.goalsJson) : [],
      weekGoals: weekGoals ? JSON.parse(weekGoals.goalsJson) : [],
      planText: dailyEntry.planText || '',
      factText: dailyEntry.factText || '',
      contextText: dailyEntry.contextText || undefined,  // Новое поле
      date: date.toLocaleDateString('ru-RU'),
      openTasks: openTasks.map((t) => `[${t.taskType}] ${t.taskText}`),
      selectedCriteria: selectedCriteria.length > 0
        ? selectedCriteria.map(sc => ({
            key: sc.criteria.key,
            nameRu: sc.criteria.nameRu,
            category: sc.criteria.category
          }))
        : undefined, // Используем дефолтные если не выбраны
      userProfile: userProfile
        ? {
            name: userProfile.name || undefined,
            occupation: userProfile.occupation || undefined,
            industry: userProfile.industry || undefined,
            maritalStatus: userProfile.maritalStatus || undefined,
            hobbies: userProfile.hobbies || undefined,
            sports: userProfile.sports || undefined,
            location: userProfile.location || undefined,
            age: userProfile.age || undefined,
            education: userProfile.education || undefined,
            teamSize: userProfile.teamSize || undefined,
            workExperience: userProfile.workExperience || undefined,
            values: userProfile.values || undefined,
            challenges: userProfile.challenges || undefined,
            other: userProfile.other || undefined,
          }
        : undefined,
    }

    // Call Claude API
    const evaluationResponse = await evaluateDay(evaluationRequest)

    // Save evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        dailyEntryId,
        // Старые поля для обратной совместимости
        strategyScore: evaluationResponse.strategy_score || null,
        operationsScore: evaluationResponse.operations_score || null,
        teamScore: evaluationResponse.team_score || null,
        efficiencyScore: evaluationResponse.efficiency_score || null,
        // Новое поле - динамические оценки в JSON
        scoresJson: evaluationResponse.scores ? JSON.stringify(evaluationResponse.scores) : null,
        overallScore: evaluationResponse.overall_score,
        feedbackText: evaluationResponse.feedback,
        planVsFactText: evaluationResponse.plan_vs_fact,
        alignmentDayWeek: evaluationResponse.alignment.day_to_week,
        alignmentWeekMonth: evaluationResponse.alignment.week_to_month,
        alignmentMonthQuarter: evaluationResponse.alignment.month_to_quarter,
        alignmentQuarterHalf: evaluationResponse.alignment.quarter_to_half,
        alignmentHalfYear: evaluationResponse.alignment.half_to_year,
        alignmentYearDream: evaluationResponse.alignment.year_to_dream,
        recommendationsText: evaluationResponse.recommendations,
      },
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Error evaluating day:', error)
    return NextResponse.json({ error: 'Failed to evaluate day' }, { status: 500 })
  }
}
