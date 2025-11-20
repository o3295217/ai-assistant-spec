import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/daily/list?from=2025-10-01&to=2025-11-09
 * Получить список дней за период
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fromStr = searchParams.get('from')
    const toStr = searchParams.get('to')

    const where: any = {}

    if (fromStr) {
      where.date = { ...where.date, gte: new Date(fromStr) }
    }

    if (toStr) {
      where.date = { ...where.date, lte: new Date(toStr) }
    }

    const entries = await prisma.dailyEntry.findMany({
      where,
      include: {
        evaluation: {
          select: {
            overallScore: true,
            strategyScore: true,
            operationsScore: true,
            teamScore: true,
            efficiencyScore: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching daily entries list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily entries' },
      { status: 500 }
    )
  }
}
