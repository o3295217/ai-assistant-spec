import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tasks?includeСlosed=false
 * Получить список задач
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeClosed = searchParams.get('includeClosed') === 'true'

    const tasks = await prisma.openTask.findMany({
      where: includeClosed ? {} : { isClosed: false },
      orderBy: [
        { isClosed: 'asc' },
        { originDate: 'desc' },
      ],
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Создать новую задачу
 * Body: { taskText: string, taskType: 'strategic' | 'operational', originDate: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskText, taskType, originDate } = body

    if (!taskText || !taskType) {
      return NextResponse.json(
        { error: 'taskText and taskType are required' },
        { status: 400 }
      )
    }

    if (!['strategic', 'operational'].includes(taskType)) {
      return NextResponse.json(
        { error: 'taskType must be either strategic or operational' },
        { status: 400 }
      )
    }

    const task = await prisma.openTask.create({
      data: {
        taskText,
        taskType,
        originDate: originDate ? new Date(originDate) : new Date(),
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
