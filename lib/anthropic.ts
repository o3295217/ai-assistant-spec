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

export interface DayData {
  date: string
  planText: string
  factText: string
  evaluation?: {
    strategyScore: number
    operationsScore: number
    teamScore: number
    efficiencyScore: number
    overallScore: number
    feedbackText: string
  }
}

export interface PeriodReportRequest {
  periodType: 'week' | 'month' | 'quarter' | 'custom'
  startDate: string
  endDate: string
  days: DayData[]
  userProfile?: UserProfile
  dreamGoal?: string
  periodGoals?: string[]
}

export interface PeriodReportResponse {
  summary: string
  achievements: string
  challenges: string
  recommendations: string
  trends: {
    strategy: 'up' | 'down' | 'stable'
    operations: 'up' | 'down' | 'stable'
    team: 'up' | 'down' | 'stable'
    efficiency: 'up' | 'down' | 'stable'
  }
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

export async function evaluatePeriod(request: PeriodReportRequest): Promise<PeriodReportResponse> {
  // Формируем блок с информацией о пользователе
  let userProfileSection = ''
  if (request.userProfile) {
    const p = request.userProfile
    const profileDetails: string[] = []

    if (p.name) profileDetails.push(`Имя: ${p.name}`)
    if (p.occupation) profileDetails.push(`Должность: ${p.occupation}`)
    if (p.industry) profileDetails.push(`Сфера деятельности: ${p.industry}`)

    if (profileDetails.length > 0) {
      userProfileSection = `👤 ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
${profileDetails.join('\n')}

`
    }
  }

  // Формируем данные о днях
  const daysWithEvaluation = request.days.filter((d) => d.evaluation)
  const totalDays = request.days.length
  const evaluatedDays = daysWithEvaluation.length

  // Считаем средние оценки
  const avgScores = {
    strategy: 0,
    operations: 0,
    team: 0,
    efficiency: 0,
    overall: 0,
  }

  if (evaluatedDays > 0) {
    daysWithEvaluation.forEach((day) => {
      if (day.evaluation) {
        avgScores.strategy += day.evaluation.strategyScore
        avgScores.operations += day.evaluation.operationsScore
        avgScores.team += day.evaluation.teamScore
        avgScores.efficiency += day.evaluation.efficiencyScore
        avgScores.overall += day.evaluation.overallScore
      }
    })

    avgScores.strategy = Math.round((avgScores.strategy / evaluatedDays) * 10) / 10
    avgScores.operations = Math.round((avgScores.operations / evaluatedDays) * 10) / 10
    avgScores.team = Math.round((avgScores.team / evaluatedDays) * 10) / 10
    avgScores.efficiency = Math.round((avgScores.efficiency / evaluatedDays) * 10) / 10
    avgScores.overall = Math.round((avgScores.overall / evaluatedDays) * 10) / 10
  }

  // Формируем детальный список дней
  const daysDetails = request.days
    .map((day) => {
      let dayInfo = `📅 ${day.date}:\n`
      dayInfo += `  План: ${day.planText.substring(0, 150)}${day.planText.length > 150 ? '...' : ''}\n`
      dayInfo += `  Факт: ${day.factText.substring(0, 150)}${day.factText.length > 150 ? '...' : ''}\n`

      if (day.evaluation) {
        dayInfo += `  Оценки: Стратегия ${day.evaluation.strategyScore}, Операции ${day.evaluation.operationsScore}, Команда ${day.evaluation.teamScore}, Эффективность ${day.evaluation.efficiencyScore}, Общая ${day.evaluation.overallScore}\n`
      } else {
        dayInfo += `  (День не оценен)\n`
      }

      return dayInfo
    })
    .join('\n')

  // Формируем цели периода
  let goalsSection = ''
  if (request.dreamGoal) {
    goalsSection += `🎯 МЕЧТА: ${request.dreamGoal}\n\n`
  }
  if (request.periodGoals && request.periodGoals.length > 0) {
    goalsSection += `📋 ЦЕЛИ ПЕРИОДА:\n${request.periodGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\n`
  }

  const periodTypeRu = {
    week: 'недели',
    month: 'месяца',
    quarter: 'квартала',
    custom: 'периода',
  }

  // CACHEABLE: System instructions
  const systemInstructions = `Ты строгий ИИ-аналитик для управления эффективностью руководителя компании.

ТВОЯ ЗАДАЧА - провести глубокий анализ работы за период и дать конструктивную обратную связь.

АНАЛИЗИРУЙ:
1. Общую динамику и тренды (улучшение/ухудшение по каждой метрике)
2. Ключевые достижения и успехи
3. Проблемы и вызовы, с которыми столкнулся
4. Паттерны поведения (что работает, что нет)
5. Соответствие целям периода
6. Баланс стратегической и операционной работы

ФОРМАТ ОТВЕТА - СТРОГО JSON:
{
  "summary": "краткое резюме периода (3-5 предложений)",
  "achievements": "список ключевых достижений (bullet points)",
  "challenges": "основные проблемы и вызовы (bullet points)",
  "recommendations": "конкретные рекомендации на следующий период (bullet points)",
  "trends": {
    "strategy": "up/down/stable",
    "operations": "up/down/stable",
    "team": "up/down/stable",
    "efficiency": "up/down/stable"
  }
}`

  // Context block
  const contextBlock = `${userProfileSection}${goalsSection}АНАЛИЗ ${periodTypeRu[request.periodType].toUpperCase()}
Период: ${request.startDate} - ${request.endDate}
Всего дней в периоде: ${totalDays}
Дней с оценками: ${evaluatedDays}

СРЕДНИЕ ОЦЕНКИ ЗА ПЕРИОД:
- Стратегическое развитие: ${avgScores.strategy}
- Операционное управление: ${avgScores.operations}
- Работа с командой: ${avgScores.team}
- Эффективность времени: ${avgScores.efficiency}
- Общая оценка: ${avgScores.overall}

ДЕТАЛИ ПО ДНЯМ:
${daysDetails}`

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
        content: contextBlock,
      },
    ],
  })

  // Log cache usage stats for monitoring
  if (message.usage) {
    console.log('🔍 Anthropic API Usage (Period Report):', {
      input_tokens: message.usage.input_tokens,
      cache_creation_input_tokens: (message.usage as any).cache_creation_input_tokens || 0,
      cache_read_input_tokens: (message.usage as any).cache_read_input_tokens || 0,
      output_tokens: message.usage.output_tokens,
    })
  }

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to parse period report response')
  }

  return JSON.parse(jsonMatch[0])
}
