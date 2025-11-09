import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns'

export type PeriodType = 'week' | 'month' | 'quarter' | 'half_year' | 'year'

export interface Period {
  type: PeriodType
  start: Date
  end: Date
  label: string
}

/**
 * Получить даты начала и конца для указанного типа периода
 */
export function getPeriodDates(date: Date, periodType: PeriodType): Period {
  switch (periodType) {
    case 'week':
      return {
        type: 'week',
        start: startOfWeek(date, { weekStartsOn: 1 }), // Понедельник
        end: endOfWeek(date, { weekStartsOn: 1 }), // Воскресенье
        label: 'Неделя',
      }

    case 'month':
      return {
        type: 'month',
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: 'Месяц',
      }

    case 'quarter':
      const quarter = Math.floor(date.getMonth() / 3) + 1
      return {
        type: 'quarter',
        start: startOfQuarter(date),
        end: endOfQuarter(date),
        label: `Квартал Q${quarter}`,
      }

    case 'half_year':
      const halfYear = date.getMonth() < 6 ? 1 : 2
      const halfStart = new Date(date.getFullYear(), halfYear === 1 ? 0 : 6, 1)
      const halfEnd = new Date(date.getFullYear(), halfYear === 1 ? 5 : 11, 31, 23, 59, 59)
      return {
        type: 'half_year',
        start: halfStart,
        end: halfEnd,
        label: `Полугодие H${halfYear}`,
      }

    case 'year':
      return {
        type: 'year',
        start: startOfYear(date),
        end: endOfYear(date),
        label: `Год ${date.getFullYear()}`,
      }

    default:
      throw new Error(`Unknown period type: ${periodType}`)
  }
}

/**
 * Получить все периоды для указанной даты
 */
export function getAllPeriods(date: Date = new Date()): Record<PeriodType, Period> {
  return {
    week: getPeriodDates(date, 'week'),
    month: getPeriodDates(date, 'month'),
    quarter: getPeriodDates(date, 'quarter'),
    half_year: getPeriodDates(date, 'half_year'),
    year: getPeriodDates(date, 'year'),
  }
}
