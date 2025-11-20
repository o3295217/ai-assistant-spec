import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/criteria - Получить все доступные критерии
export async function GET() {
  try {
    const criteria = await prisma.evaluationCriteria.findMany({
      orderBy: { order: 'asc' }
    })

    // Группируем по категориям для удобства
    const grouped = criteria.reduce((acc, criterion) => {
      if (!acc[criterion.category]) {
        acc[criterion.category] = []
      }
      acc[criterion.category].push(criterion)
      return acc
    }, {} as Record<string, typeof criteria>)

    return NextResponse.json({
      all: criteria,
      byCategory: grouped
    })
  } catch (error) {
    console.error('Error fetching criteria:', error)
    return NextResponse.json(
      { error: 'Failed to fetch criteria' },
      { status: 500 }
    )
  }
}
