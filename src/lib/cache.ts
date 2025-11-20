import NodeCache from 'node-cache'

// Кэш на 5 минут для целей
const goalsCache = new NodeCache({ stdTTL: 300 })

export function getCachedGoals(key: string) {
  return goalsCache.get(key)
}

export function setCachedGoals(key: string, data: any) {
  goalsCache.set(key, data)
}

export function clearGoalsCache() {
  goalsCache.flushAll()
}

// Кэш для оценок (10 минут)
const evaluationCache = new NodeCache({ stdTTL: 600 })

export function getCachedEvaluation(dailyEntryId: number) {
  return evaluationCache.get(`eval_${dailyEntryId}`)
}

export function setCachedEvaluation(dailyEntryId: number, data: any) {
  evaluationCache.set(`eval_${dailyEntryId}`, data)
}

export function clearEvaluationCache(dailyEntryId: number) {
  evaluationCache.del(`eval_${dailyEntryId}`)
}
