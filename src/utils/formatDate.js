const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Parses an API value into a Date, or null when it is missing or unparseable.
 *
 * A bare "YYYY-MM-DD" (how the API sends a tour's start and end date) is read by
 * `new Date()` as UTC midnight, so west of Greenwich a tour starting on the 9th would
 * render as the 8th. Those are calendar days, not instants — parse them as local.
 */
function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const text = String(value)
  const date = new Date(DATE_ONLY.test(text) ? `${text}T00:00:00` : text)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value, locale = 'en-US', options) {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat(locale, options || { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export function formatDateTime(value, locale = 'en-US') {
  return formatDate(value, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * A tour's departure window: "Sep 9 – 15, 2026".
 *
 * Intl's formatRange collapses whatever the two dates share, in the order the locale
 * puts them — "9–15 сент. 2026 г." in Russian — so a range inside one month does not
 * repeat the month and year. Returns '' when neither date is set, so callers can hide
 * the row rather than print a dash.
 */
export function formatDateRange(start, end, locale = 'en-US') {
  const from = toDate(start)
  const to = toDate(end)
  if (!from && !to) return ''
  if (!from || !to) return formatDate(from || to, locale)
  // A range stored back to front would read as "Sep 15 – 9"; show the start alone.
  if (to < from) return formatDate(from, locale)

  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    .formatRange(from, to)
}

/** Formats a duration given in days as "3 days / 2 nights". */
export function formatDuration(days, nights) {
  if (!days) return '—'
  const parts = [`${days} ${days === 1 ? 'day' : 'days'}`]
  if (nights) parts.push(`${nights} ${nights === 1 ? 'night' : 'nights'}`)
  return parts.join(' / ')
}

/** For <input type="date"> values. */
export function toInputDate(value) {
  const date = toDate(value)
  if (!date) return ''
  // Local components, not toISOString(): the latter shifts to UTC and can hand back
  // the previous day for a date the user picked.
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
