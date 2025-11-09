import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * GET /api/daily?date=2025-11-09
 * Получить запись за конкретный день
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date parameter is required' },
        { status: 400 }
      )
    }

    const date = startOfDay(new Date(dateStr))

    const entry = await prisma.dailyEntry.findFirst({
      where: { date },
      include: {
        evaluation: true,
      },
    })

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error fetching daily entry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily entry' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/daily
 * Создать или обновить план/факт на день
 * Body: { date: string, planText?: string, factText?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date: dateStr, planText, factText } = body

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      )
    }

    const date = startOfDay(new Date(dateStr))

    // Проверяем существующую запись
    const existing = await prisma.dailyEntry.findFirst({
      where: { date },
    })

    const updateData: any = {}
    if (planText !== undefined) updateData.planText = planText
    if (factText !== undefined) updateData.factText = factText

    let entry
    if (existing) {
      // Обновляем
      entry = await prisma.dailyEntry.update({
        where: { id: existing.id },
        data: updateData,
      })
    } else {
      // Создаем новую
      entry = await prisma.dailyEntry.create({
        data: {
          date,
          ...updateData,
        },
      })
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error saving daily entry:', error)
    return NextResponse.json(
      { error: 'Failed to save daily entry' },
      { status: 500 }
    )
  }
}
