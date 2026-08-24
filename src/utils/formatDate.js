export function formatDate(value, locale = 'en-US', options) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
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

/** Formats a duration given in days as "3 days / 2 nights". */
export function formatDuration(days, nights) {
  if (!days) return '—'
  const parts = [`${days} ${days === 1 ? 'day' : 'days'}`]
  if (nights) parts.push(`${nights} ${nights === 1 ? 'night' : 'nights'}`)
  return parts.join(' / ')
}

/** For <input type="date"> values. */
export function toInputDate(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
