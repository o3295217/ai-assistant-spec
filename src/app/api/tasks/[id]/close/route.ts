import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/tasks/:id/close
 * Закрыть задачу
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const task = await prisma.openTask.update({
      where: { id: taskId },
      data: {
        isClosed: true,
        closedAt: new Date(),
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error closing task:', error)
    return NextResponse.json(
      { error: 'Failed to close task' },
      { status: 500 }
    )
  }
}
