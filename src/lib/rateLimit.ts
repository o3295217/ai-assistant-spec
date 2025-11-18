// Rate limiting для API endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 минут
const MAX_REQUESTS = 10 // максимум 10 запросов

export function rateLimit(identifier: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    // Новое окно
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, reset: now + RATE_LIMIT_WINDOW }
  }

  if (userLimit.count >= MAX_REQUESTS) {
    // Превышен лимит
    return { success: false, limit: MAX_REQUESTS, remaining: 0, reset: userLimit.resetTime }
  }

  // Увеличить счетчик
  userLimit.count++
  return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - userLimit.count, reset: userLimit.resetTime }
}

export function getRateLimitHeaders(limit: number, remaining: number, reset: number) {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(reset).toISOString()
  }
}
