import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'

export const parseMultiple = (
  dateString: string,
  formats: string[],
  referenceDate: Date,
  options?: {
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    useAdditionalWeekYearTokens?: boolean
    useAdditionalDayOfYearTokens?: boolean
  },
): Date | null => {
  for (const format of formats) {
    const result = parse(dateString, format, referenceDate, options)
    if (isValid(result)) {
      return result
    }
  }

  return null
}
