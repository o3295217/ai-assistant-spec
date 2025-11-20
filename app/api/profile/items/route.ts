import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/profile/items - создать новый пункт в блоке
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockId, content } = body

    if (!blockId || !content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Block ID and content are required' }, { status: 400 })
    }

    // Получаем максимальный order для нового пункта в этом блоке
    const maxOrder = await prisma.profileItem.aggregate({
      where: { blockId: parseInt(blockId) },
      _max: { order: true },
    })

    const item = await prisma.profileItem.create({
      data: {
        blockId: parseInt(blockId),
        content: content.trim(),
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating profile item:', error)
    return NextResponse.json({ error: 'Failed to create profile item' }, { status: 500 })
  }
}

// DELETE /api/profile/items?id=123 - удалить пункт
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    await prisma.profileItem.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting profile item:', error)
    return NextResponse.json({ error: 'Failed to delete profile item' }, { status: 500 })
  }
}

// PATCH /api/profile/items - обновить содержимое пункта
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, content } = body

    if (!id || !content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'ID and content are required' }, { status: 400 })
    }

    const item = await prisma.profileItem.update({
      where: { id: parseInt(id) },
      data: { content: content.trim() },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating profile item:', error)
    return NextResponse.json({ error: 'Failed to update profile item' }, { status: 500 })
  }
}
