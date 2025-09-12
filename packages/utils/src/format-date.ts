/**
 * Format date options
 */
export interface FormatDateOptions {
  /** Include time in the formatted string */
  includeTime?: boolean
  /** Locale for formatting (defaults to 'en-US') */
  locale?: string
  /** Timezone for formatting */
  timeZone?: string
  /** Custom format style */
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  /** Custom time style */
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
}

/**
 * Format a date into a human-readable string
 *
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date('2023-12-25'))
 * // Returns: 'Dec 25, 2023'
 *
 * formatDate(new Date(), { includeTime: true })
 * // Returns: 'Dec 25, 2023, 2:30 PM'
 *
 * formatDate(new Date(), { dateStyle: 'full' })
 * // Returns: 'Monday, December 25, 2023'
 * ```
 */
export function formatDate(
  date: Date | string | number,
  options: FormatDateOptions = {}
): string {
  const {
    includeTime = false,
    locale = 'en-US',
    timeZone,
    dateStyle = 'medium',
    timeStyle = 'short',
  } = options

  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle,
    ...(includeTime && { timeStyle }),
    ...(timeZone && { timeZone }),
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 2))
 * // Returns: '2 hours ago'
 *
 * formatRelativeTime(new Date(Date.now() + 1000 * 60 * 60 * 24))
 * // Returns: 'in 1 day'
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ] as const

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.label)
    }
  }

  return rtf.format(0, 'second')
}
