import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPeriodDates, PeriodType } from '@/lib/periods'

/**
 * GET /api/goals/period?type=week&date=2025-11-09
 * Получить цели для указанного периода
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as PeriodType
    const dateStr = searchParams.get('date')

    if (!type || !['week', 'month', 'quarter', 'half_year', 'year'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid period type. Must be one of: week, month, quarter, half_year, year' },
        { status: 400 }
      )
    }

    const date = dateStr ? new Date(dateStr) : new Date()
    const period = getPeriodDates(date, type)

    // Ищем цели для этого периода
    const goals = await prisma.periodGoals.findFirst({
      where: {
        periodType: type,
        periodStart: {
          lte: period.end,
        },
        periodEnd: {
          gte: period.start,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({
      period: {
        type,
        start: period.start,
        end: period.end,
        label: period.label,
      },
      goals: goals ? JSON.parse(goals.goalsJson) : [],
      goalsRecord: goals,
    })
  } catch (error) {
    console.error('Error fetching period goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch period goals' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/goals/period
 * Создать или обновить цели для периода
 * Body: { periodType: string, goals: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { periodType, goals, date } = body

    if (!periodType || !['week', 'month', 'quarter', 'half_year', 'year'].includes(periodType)) {
      return NextResponse.json(
        { error: 'Invalid period type' },
        { status: 400 }
      )
    }

    if (!Array.isArray(goals)) {
      return NextResponse.json(
        { error: 'goals must be an array' },
        { status: 400 }
      )
    }

    const currentDate = date ? new Date(date) : new Date()
    const period = getPeriodDates(currentDate, periodType as PeriodType)

    // Ищем существующую запись для этого периода
    const existing = await prisma.periodGoals.findFirst({
      where: {
        periodType,
        periodStart: period.start,
        periodEnd: period.end,
      },
    })

    let periodGoals
    if (existing) {
      // Обновляем
      periodGoals = await prisma.periodGoals.update({
        where: { id: existing.id },
        data: { goalsJson: JSON.stringify(goals) },
      })
    } else {
      // Создаем новую
      periodGoals = await prisma.periodGoals.create({
        data: {
          periodType,
          periodStart: period.start,
          periodEnd: period.end,
          goalsJson: JSON.stringify(goals),
        },
      })
    }

    return NextResponse.json({
      periodGoals,
      goals: JSON.parse(periodGoals.goalsJson),
    })
  } catch (error) {
    console.error('Error saving period goals:', error)
    return NextResponse.json(
      { error: 'Failed to save period goals' },
      { status: 500 }
    )
  }
}
