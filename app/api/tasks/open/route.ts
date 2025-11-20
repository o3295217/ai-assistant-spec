import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.openTask.findMany({
      where: { isClosed: false },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching open tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch open tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskText, taskType, originDate } = body

    if (!taskText || !taskType || !originDate) {
      return NextResponse.json({ error: 'taskText, taskType, and originDate are required' }, { status: 400 })
    }

    const task = await prisma.openTask.create({
      data: {
        taskText,
        taskType,
        originDate: new Date(originDate),
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
