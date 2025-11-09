import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { anthropic, MODEL_NAME } from '@/lib/anthropic'
import { getAllPeriods } from '@/lib/periods'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * POST /api/evaluate
 * Оценить день через Claude API
 * Body: { date: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date: dateStr } = body

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      )
    }

    const date = new Date(dateStr)

    // Получаем запись за день
    const dailyEntry = await prisma.dailyEntry.findFirst({
      where: { date },
    })

    if (!dailyEntry) {
      return NextResponse.json(
        { error: 'Daily entry not found for this date' },
        { status: 404 }
      )
    }

    if (!dailyEntry.planText || !dailyEntry.factText) {
      return NextResponse.json(
        { error: 'Both plan and fact must be filled before evaluation' },
        { status: 400 }
      )
    }

    // Получаем мечту
    const dream = await prisma.dreamGoal.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    // Получаем все периоды
    const periods = getAllPeriods(date)

    // Получаем цели для каждого периода
    const periodGoals: Record<string, string[]> = {}

    for (const [key, period] of Object.entries(periods)) {
      const goals = await prisma.periodGoals.findFirst({
        where: {
          periodType: key,
          periodStart: { lte: period.end },
          periodEnd: { gte: period.start },
        },
        orderBy: { updatedAt: 'desc' },
      })
      periodGoals[key] = goals ? JSON.parse(goals.goalsJson) : []
    }

    // Получаем незакрытые задачи
    const openTasks = await prisma.openTask.findMany({
      where: { isClosed: false },
    })

    // Формируем промпт для Claude
    const prompt = buildEvaluationPrompt({
      date,
      dream: dream?.goalText || 'Не указана',
      yearGoals: periodGoals.year,
      halfYearGoals: periodGoals.half_year,
      quarterGoals: periodGoals.quarter,
      monthGoals: periodGoals.month,
      weekGoals: periodGoals.week,
      planText: dailyEntry.planText,
      factText: dailyEntry.factText,
      openTasks: openTasks.map(t => `[${t.taskType}] ${t.taskText}`),
    })

    // Запрос к Claude API
    const response = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Парсим ответ
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const evaluationData = parseClaudeResponse(content.text)

    // Сохраняем оценку в БД
    const evaluation = await prisma.evaluation.create({
      data: {
        dailyEntryId: dailyEntry.id,
        strategyScore: evaluationData.strategy_score,
        operationsScore: evaluationData.operations_score,
        teamScore: evaluationData.team_score,
        efficiencyScore: evaluationData.efficiency_score,
        overallScore: evaluationData.overall_score,
        feedbackText: evaluationData.feedback,
        planVsFactText: evaluationData.plan_vs_fact,
        alignmentDayWeek: evaluationData.alignment.day_to_week,
        alignmentWeekMonth: evaluationData.alignment.week_to_month,
        alignmentMonthQuarter: evaluationData.alignment.month_to_quarter,
        alignmentQuarterHalf: evaluationData.alignment.quarter_to_half,
        alignmentHalfYear: evaluationData.alignment.half_to_year,
        alignmentYearDream: evaluationData.alignment.year_to_dream,
        recommendationsText: evaluationData.recommendations,
      },
    })

    return NextResponse.json({ evaluation, evaluationData })
  } catch (error: any) {
    console.error('Error evaluating day:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate day', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/evaluate?dailyEntryId=123
 * Получить сохраненную оценку
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dailyEntryId = searchParams.get('dailyEntryId')

    if (!dailyEntryId) {
      return NextResponse.json(
        { error: 'dailyEntryId is required' },
        { status: 400 }
      )
    }

    const evaluation = await prisma.evaluation.findFirst({
      where: { dailyEntryId: parseInt(dailyEntryId) },
      include: {
        dailyEntry: true,
      },
    })

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error('Error fetching evaluation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    )
  }
}

// Вспомогательные функции

interface EvaluationPromptParams {
  date: Date
  dream: string
  yearGoals: string[]
  halfYearGoals: string[]
  quarterGoals: string[]
  monthGoals: string[]
  weekGoals: string[]
  planText: string
  factText: string
  openTasks: string[]
}

function buildEvaluationPrompt(params: EvaluationPromptParams): string {
  const {
    date,
    dream,
    yearGoals,
    halfYearGoals,
    quarterGoals,
    monthGoals,
    weekGoals,
    planText,
    factText,
    openTasks,
  } = params

  const dateFormatted = format(date, 'dd MMMM yyyy, EEEE', { locale: ru })
  const currentYear = date.getFullYear()
  const currentMonth = format(date, 'LLLL yyyy', { locale: ru })
  const currentQuarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${currentYear}`
  const currentHalf = `H${date.getMonth() < 6 ? 1 : 2} ${currentYear}`

  return `Ты строгий ИИ-ассистент для управления эффективностью руководителя компании.

ИЕРАРХИЯ ЦЕЛЕЙ:

🎯 МЕЧТА (5 лет):
${dream}

📅 ЦЕЛИ НА ТЕКУЩИЙ ГОД (${currentYear}):
${yearGoals.length > 0 ? yearGoals.map((g, i) => `${i + 1}. ${g}`).join('\n') : 'Не указаны'}

📆 ЦЕЛИ НА ТЕКУЩЕЕ ПОЛУГОДИЕ (${currentHalf}):
${halfYearGoals.length > 0 ? halfYearGoals.map((g, i) => `${i + 1}. ${g}`).join('\n') : 'Не указаны'}

📊 ЦЕЛИ НА ТЕКУЩИЙ КВАРТАЛ (${currentQuarter}):
${quarterGoals.length > 0 ? quarterGoals.map((g, i) => `${i + 1}. ${g}`).join('\n') : 'Не указаны'}

📋 ЦЕЛИ НА ТЕКУЩИЙ МЕСЯЦ (${currentMonth}):
${monthGoals.length > 0 ? monthGoals.map((g, i) => `${i + 1}. ${g}`).join('\n') : 'Не указаны'}

📌 ЦЕЛИ НА ТЕКУЩУЮ НЕДЕЛЮ:
${weekGoals.length > 0 ? weekGoals.map((g, i) => `${i + 1}. ${g}`).join('\n') : 'Не указаны'}

---

📝 ПЛАН НА СЕГОДНЯ (${dateFormatted}):
${planText}

✅ ФАКТ ВЫПОЛНЕНИЯ:
${factText}

❌ НЕЗАКРЫТЫЕ ЗАДАЧИ ИЗ ПРОШЛОГО:
${openTasks.length > 0 ? openTasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'Нет'}

---

ТВОЯ ЗАДАЧА:

1. Оцени день по 4 критериям (1-10):
   - Стратегическое развитие
   - Операционное управление
   - Работа с командой
   - Эффективность времени

2. Рассчитай общую оценку (среднее)

3. Проанализируй план vs факт:
   - Какие задачи выполнены
   - Какие не выполнены
   - Почему

4. ГЛАВНОЕ - проверь alignment (выравнивание):
   - Работают ли задачи сегодня на недельные цели?
   - Работают ли недельные на месячные?
   - Работают ли месячные на квартальные?
   - Работают ли квартальные на полугодовые?
   - Работают ли полугодовые на годовые?
   - Работают ли годовые на мечту?

5. Дай жесткую конструктивную критику (без сахара)

6. Дай конкретные рекомендации на завтра

ФОРМАТ ОТВЕТА - СТРОГО JSON:
{
  "strategy_score": число 1-10,
  "operations_score": число 1-10,
  "team_score": число 1-10,
  "efficiency_score": число 1-10,
  "overall_score": число 1-10 (среднее с точностью до 0.5),
  "plan_vs_fact": "текст анализа",
  "feedback": "жесткая обратная связь",
  "alignment": {
    "day_to_week": "анализ + статус (works/partial/no)",
    "week_to_month": "анализ + статус",
    "month_to_quarter": "анализ + статус",
    "quarter_to_half": "анализ + статус",
    "half_to_year": "анализ + статус",
    "year_to_dream": "анализ + статус"
  },
  "recommendations": "конкретные рекомендации"
}`
}

function parseClaudeResponse(text: string): any {
  // Извлекаем JSON из ответа (может быть обернут в markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  try {
    const parsed = JSON.parse(jsonMatch[0])
    return parsed
  } catch (error) {
    throw new Error('Failed to parse JSON from Claude response')
  }
}
