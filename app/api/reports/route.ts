import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports - получить все отчеты
export async function GET() {
  try {
    const reports = await prisma.periodReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // последние 50 отчетов
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
