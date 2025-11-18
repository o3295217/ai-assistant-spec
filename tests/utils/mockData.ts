/**
 * Mock Data for Testing
 * Provides realistic test data matching the specification
 */

export const mockDreamGoal = {
  id: 1,
  goal_text: 'Стать топ-менеджером федеральной IT-компании с управлением департаментом 200+ человек и влиянием на стратегические решения компании',
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-01-01'),
};

export const mockYearGoals = [
  'Вырастить Тетроникс Сервис до 50+ сотрудников',
  'Достичь выручки 200 млн рублей',
  'Запустить новое направление в медицине',
  'Выстроить систему управления и делегирования',
];

export const mockWeekGoals = [
  'Завершить систему оплаты труда РОП',
  'Согласовать KPI на декабрь',
  'Провести 3 встречи по проекту ЕНКО',
  'Начать обучение по информационной безопасности',
];

export const mockPeriodGoal = {
  id: 1,
  period_type: 'week',
  period_start: new Date('2025-11-10'),
  period_end: new Date('2025-11-16'),
  goals_json: JSON.stringify(mockWeekGoals),
  created_at: new Date('2025-11-10'),
  updated_at: new Date('2025-11-10'),
};

export const mockDailyEntry = {
  id: 1,
  date: new Date('2025-11-18'),
  plan_text: '1. Утром - работа над ИИ ассистентом\n2. Калькулятор на 2026 год\n3. Штатное расписание на 2026\n4. Отправить второе заявление на обучение\n5. Начать курс по ИБ',
  fact_text: '1. ИИ ассистент - не сделал\n2. Калькулятор - готов\n3. Штатное расписание - не сделал\n4. Заявление - не отправил\n5. Курс начал',
  created_at: new Date('2025-11-18'),
  updated_at: new Date('2025-11-18'),
};

export const mockEvaluation = {
  id: 1,
  daily_entry_id: 1,
  strategy_score: 4,
  operations_score: 7,
  team_score: 5,
  efficiency_score: 6,
  overall_score: 5.5,
  feedback_text: 'День прошёл со средней продуктивностью. Выполнено только 2 из 5 задач.',
  plan_vs_fact_text: 'Калькулятор выполнен полностью. Курс начат. ИИ ассистент, штатное расписание и заявление не выполнены.',
  alignment_day_week: 'works',
  alignment_week_month: 'partial',
  alignment_month_quarter: 'works',
  alignment_quarter_half: 'works',
  alignment_half_year: 'no',
  alignment_year_dream: 'works',
  recommendations_text: 'Сосредоточьтесь на завершении начатых задач. Уделите больше внимания стратегическим задачам.',
  created_at: new Date('2025-11-18'),
};

export const mockOpenTask = {
  id: 1,
  task_text: 'Завершить систему оплаты труда РОП',
  task_type: 'strategic',
  origin_date: new Date('2025-11-10'),
  is_closed: false,
  closed_at: null,
  created_at: new Date('2025-11-10'),
};

export const mockClaudeResponse = {
  strategy_score: 4,
  operations_score: 7,
  team_score: 5,
  efficiency_score: 6,
  overall_score: 5.5,
  plan_vs_fact: 'Калькулятор выполнен полностью. Курс начат. ИИ ассистент, штатное расписание и заявление не выполнены.',
  feedback: 'День прошёл со средней продуктивностью. Выполнено только 2 из 5 задач.',
  alignment: {
    day_to_week: 'анализ работы дня на неделю + works',
    week_to_month: 'анализ работы недели на месяц + partial',
    month_to_quarter: 'анализ работы месяца на квартал + works',
    quarter_to_half: 'анализ работы квартала на полугодие + works',
    half_to_year: 'анализ работы полугодия на год + no',
    year_to_dream: 'анализ работы года на мечту + works',
  },
  recommendations: 'Сосредоточьтесь на завершении начатых задач. Уделите больше внимания стратегическим задачам.',
};

export const mockClaudeInvalidResponse = {
  // Missing required fields
  strategy_score: 4,
  // Missing other scores
};
