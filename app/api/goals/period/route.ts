import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPeriodDates, PeriodType } from '@/lib/dates'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as PeriodType
    const dateStr = searchParams.get('date')

    if (!type || !dateStr) {
      return NextResponse.json({ error: 'type and date are required' }, { status: 400 })
    }

    const date = new Date(dateStr)
    const { start, end } = getPeriodDates(date, type)

    const periodGoal = await prisma.periodGoal.findFirst({
      where: {
        periodType: type,
        periodStart: { lte: date },
        periodEnd: { gte: date },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      periodGoal
        ? { ...periodGoal, goals: JSON.parse(periodGoal.goalsJson) }
        : { periodType: type, periodStart: start, periodEnd: end, goals: [] }
    )
  } catch (error) {
    console.error('Error fetching period goals:', error)
    return NextResponse.json({ error: 'Failed to fetch period goals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { periodType, periodStart, periodEnd, goals } = body

    if (!periodType || !periodStart || !periodEnd || !Array.isArray(goals)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const periodGoal = await prisma.periodGoal.create({
      data: {
        periodType,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        goalsJson: JSON.stringify(goals),
      },
    })

    return NextResponse.json({ ...periodGoal, goals: JSON.parse(periodGoal.goalsJson) })
  } catch (error) {
    console.error('Error creating period goals:', error)
    return NextResponse.json({ error: 'Failed to create period goals' }, { status: 500 })
  }
}
