import { NextResponse } from 'next/server'
import { calculateStreak } from '@/lib/analytics'

export async function GET() {
  try {
    const streak = await calculateStreak()
    return NextResponse.json(streak)
  } catch (error) {
    console.error('Error calculating streak:', error)
    return NextResponse.json({ error: 'Failed to calculate streak' }, { status: 500 })
  }
}
