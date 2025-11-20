import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const USER_ID = 1 // Single-user app

// GET /api/criteria/selected - Получить выбранные критерии пользователя
export async function GET() {
  try {
    const selectedCriteria = await prisma.userSelectedCriteria.findMany({
      where: {
        userId: USER_ID,
        isEnabled: true
      },
      include: {
        criteria: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(selectedCriteria.map(sc => sc.criteria))
  } catch (error) {
    console.error('Error fetching selected criteria:', error)
    return NextResponse.json(
      { error: 'Failed to fetch selected criteria' },
      { status: 500 }
    )
  }
}

// POST /api/criteria/selected - Обновить выбранные критерии
export async function POST(request: Request) {
  try {
    const { criteriaIds }: { criteriaIds: number[] } = await request.json()

    if (!Array.isArray(criteriaIds) || criteriaIds.length === 0) {
      return NextResponse.json(
        { error: 'criteriaIds must be a non-empty array' },
        { status: 400 }
      )
    }

    // Удаляем старые выборы
    await prisma.userSelectedCriteria.deleteMany({
      where: { userId: USER_ID }
    })

    // Создаем новые
    const newSelections = await prisma.userSelectedCriteria.createMany({
      data: criteriaIds.map((criteriaId, index) => ({
        userId: USER_ID,
        criteriaId,
        isEnabled: true,
        order: index
      }))
    })

    // Получаем обновленный список
    const selectedCriteria = await prisma.userSelectedCriteria.findMany({
      where: {
        userId: USER_ID,
        isEnabled: true
      },
      include: {
        criteria: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      count: newSelections.count,
      selected: selectedCriteria.map(sc => sc.criteria)
    })
  } catch (error) {
    console.error('Error updating selected criteria:', error)
    return NextResponse.json(
      { error: 'Failed to update selected criteria' },
      { status: 500 }
    )
  }
}
