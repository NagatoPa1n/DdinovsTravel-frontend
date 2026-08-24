/**
 * Currencies a tour can be priced in, in the order they appear in the admin dropdowns.
 *
 * Free-form on the API side (Tour.currency is a plain String), so this list is the only
 * thing constraining the choice — adding a code here is all that is needed to offer it.
 */
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'UZS']

const DEFAULT_CURRENCY = 'USD'

export function formatPrice(amount, currency = DEFAULT_CURRENCY, locale = 'en-US') {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
  }).format(Number(amount))
}

export function formatPriceRange(from, to, currency = DEFAULT_CURRENCY) {
  if (from && to && from !== to) return `${formatPrice(from, currency)} – ${formatPrice(to, currency)}`
  return formatPrice(from ?? to, currency)
}
