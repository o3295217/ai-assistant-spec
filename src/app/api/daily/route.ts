import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit'
import { DailyEntrySchema, validateData } from '@/lib/validation'

// Нормализация даты - устанавливаем полночь по UTC
function normalizeDate(dateStr: string): Date {
  const date = new Date(dateStr)
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))
}

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

    const date = normalizeDate(dateStr)

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
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'localhost'
    const rateLimitResult = rateLimit(clientIP)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset)
        }
      )
    }

    const body = await request.json()
    const { date: dateStr, planText, factText } = body

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      )
    }

    // Validation
    if (planText !== undefined) {
      const planValidation = validateData(DailyEntrySchema, { text: planText })
      if (!planValidation.success) {
        return NextResponse.json(
          { error: 'Invalid plan text', details: planValidation.error },
          { status: 400 }
        )
      }
    }

    if (factText !== undefined) {
      const factValidation = validateData(DailyEntrySchema, { text: factText })
      if (!factValidation.success) {
        return NextResponse.json(
          { error: 'Invalid fact text', details: factValidation.error },
          { status: 400 }
        )
      }
    }

    const date = normalizeDate(dateStr)

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

    return NextResponse.json(
      { entry },
      { headers: getRateLimitHeaders(rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset) }
    )
  } catch (error) {
    console.error('Error saving daily entry:', error)
    return NextResponse.json(
      { error: 'Failed to save daily entry' },
      { status: 500 }
    )
  }
}
