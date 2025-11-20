import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface UserProfile {
  name?: string
  occupation?: string
  industry?: string
  maritalStatus?: string
  hobbies?: string
  sports?: string
  location?: string
  age?: number
  education?: string
  teamSize?: number
  workExperience?: string
  values?: string
  challenges?: string
  other?: string
}

export interface EvaluationRequest {
  dreamGoal: string
  yearGoals: string[]
  halfYearGoals: string[]
  quarterGoals: string[]
  monthGoals: string[]
  weekGoals: string[]
  planText: string
  factText: string
  date: string
  openTasks: string[]
  userProfile?: UserProfile
}

export interface EvaluationResponse {
  strategy_score: number
  operations_score: number
  team_score: number
  efficiency_score: number
  overall_score: number
  plan_vs_fact: string
  feedback: string
  alignment: {
    day_to_week: string
    week_to_month: string
    month_to_quarter: string
    quarter_to_half: string
    half_to_year: string
    year_to_dream: string
  }
  recommendations: string
}

export async function evaluateDay(request: EvaluationRequest): Promise<EvaluationResponse> {
  // Формируем блок с информацией о пользователе
  let userProfileSection = ''
  if (request.userProfile) {
    const p = request.userProfile
    const profileDetails: string[] = []

    if (p.name) profileDetails.push(`Имя: ${p.name}`)
    if (p.age) profileDetails.push(`Возраст: ${p.age}`)
    if (p.occupation) profileDetails.push(`Должность: ${p.occupation}`)
    if (p.industry) profileDetails.push(`Сфера деятельности: ${p.industry}`)
    if (p.teamSize) profileDetails.push(`Размер команды: ${p.teamSize} человек`)
    if (p.location) profileDetails.push(`Место проживания: ${p.location}`)
    if (p.maritalStatus) profileDetails.push(`Семейное положение: ${p.maritalStatus}`)
    if (p.education) profileDetails.push(`Образование: ${p.education}`)
    if (p.workExperience) profileDetails.push(`Опыт работы: ${p.workExperience}`)
    if (p.hobbies) profileDetails.push(`Хобби: ${p.hobbies}`)
    if (p.sports) profileDetails.push(`Спорт: ${p.sports}`)
    if (p.values) profileDetails.push(`Ценности: ${p.values}`)
    if (p.challenges) profileDetails.push(`Текущие вызовы: ${p.challenges}`)
    if (p.other) profileDetails.push(`Дополнительно: ${p.other}`)

    if (profileDetails.length > 0) {
      userProfileSection = `👤 ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
${profileDetails.join('\n')}

`
    }
  }

  // CACHEABLE: System instructions (никогда не меняются)
  const systemInstructions = `Ты строгий ИИ-ассистент для управления эффективностью руководителя компании.

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

5. УЧИТЫВАЙ КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
   - Его роль и уровень ответственности
   - Размер команды и область деятельности
   - Личные ценности и приоритеты
   - Текущие вызовы и обстоятельства
   - Баланс работы и личной жизни (хобби, спорт, семья)

6. Дай жесткую конструктивную критику (без сахара), но с учетом личности пользователя

7. Дай конкретные персонализированные рекомендации на завтра

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

  // CACHEABLE: Профиль пользователя + иерархия целей + незакрытые задачи (меняются редко)
  const contextBlock = `${userProfileSection}ИЕРАРХИЯ ЦЕЛЕЙ:

🎯 МЕЧТА (5 лет):
${request.dreamGoal}

📅 ЦЕЛИ НА ТЕКУЩИЙ ГОД:
${request.yearGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

📆 ЦЕЛИ НА ТЕКУЩЕЕ ПОЛУГОДИЕ:
${request.halfYearGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

📊 ЦЕЛИ НА ТЕКУЩИЙ КВАРТАЛ:
${request.quarterGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

📋 ЦЕЛИ НА ТЕКУЩИЙ МЕСЯЦ:
${request.monthGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

📌 ЦЕЛИ НА ТЕКУЩУЮ НЕДЕЛЮ:
${request.weekGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

❌ НЕЗАКРЫТЫЕ ЗАДАЧИ ИЗ ПРОШЛОГО:
${request.openTasks.length > 0 ? request.openTasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'Нет'}`

  // NON-CACHEABLE: План и факт на сегодня (меняется каждый раз)
  const dailyBlock = `📝 ПЛАН НА СЕГОДНЯ (${request.date}):
${request.planText}

✅ ФАКТ ВЫПОЛНЕНИЯ:
${request.factText}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: systemInstructions,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: contextBlock,
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: dailyBlock,
          },
        ],
      },
    ],
  })

  // Log cache usage stats for monitoring
  if (message.usage) {
    console.log('🔍 Anthropic API Usage:', {
      input_tokens: message.usage.input_tokens,
      cache_creation_input_tokens: (message.usage as any).cache_creation_input_tokens || 0,
      cache_read_input_tokens: (message.usage as any).cache_read_input_tokens || 0,
      output_tokens: message.usage.output_tokens,
    })
  }

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON from response (Claude might wrap it in markdown)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to parse evaluation response')
  }

  return JSON.parse(jsonMatch[0])
}
