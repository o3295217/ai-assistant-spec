import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/goals/dream
 * Получить текущую мечту (цель на 5 лет)
 */
export async function GET() {
  try {
    const dream = await prisma.dreamGoal.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ dream })
  } catch (error) {
    console.error('Error fetching dream goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dream goal' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/goals/dream
 * Создать или обновить мечту
 * Body: { goalText: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalText } = body

    if (!goalText || typeof goalText !== 'string') {
      return NextResponse.json(
        { error: 'goalText is required and must be a string' },
        { status: 400 }
      )
    }

    // Проверяем, есть ли уже мечта
    const existingDream = await prisma.dreamGoal.findFirst()

    let dream
    if (existingDream) {
      // Обновляем существующую
      dream = await prisma.dreamGoal.update({
        where: { id: existingDream.id },
        data: { goalText },
      })
    } else {
      // Создаем новую
      dream = await prisma.dreamGoal.create({
        data: { goalText },
      })
    }

    return NextResponse.json({ dream })
  } catch (error) {
    console.error('Error saving dream goal:', error)
    return NextResponse.json(
      { error: 'Failed to save dream goal' },
      { status: 500 }
    )
  }
}
