import { z } from 'zod'

// Валидация ежедневной записи
export const DailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты'),
  planText: z.string().min(10, 'План должен быть минимум 10 символов').max(5000, 'План слишком длинный').optional(),
  factText: z.string().min(10, 'Факт должен быть минимум 10 символов').max(5000, 'Факт слишком длинный').optional()
})

// Валидация целей
export const GoalSchema = z.object({
  goalText: z.string().min(10, 'Цель должна быть минимум 10 символов').max(2000, 'Цель слишком длинная')
})

// Валидация целей периода
export const PeriodGoalsSchema = z.object({
  periodType: z.enum(['year', 'half_year', 'quarter', 'month', 'week']),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  goals: z.array(z.string().min(5).max(500)).min(1, 'Должна быть хотя бы одна цель')
})

// Валидация API ключа
export const ApiKeySchema = z.string().startsWith('sk-ant-', 'Неверный формат API ключа Anthropic')

// Хелпер для безопасной валидации
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, error: firstError?.message || 'Validation error' }
    }
    return { success: false, error: 'Неизвестная ошибка валидации' }
  }
}
