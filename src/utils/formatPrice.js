/**
 * Currencies a tour can be priced in, in the order they appear in the admin dropdowns.
 *
 * Free-form on the API side (Tour.currency is a plain String), so this list is the only
 * thing constraining the choice — adding a code here is all that is needed to offer it.
 */
export const CURRENCIES = ['UZS', 'USD', 'EUR', 'GBP', 'AED']

const DEFAULT_CURRENCY = 'UZS'

/**
 * Codes we spell out after the amount instead of letting Intl pick a symbol.
 * Intl renders UZS as "UZS 12,000,000"; locally the amount is written "12 000 000 so'm".
 */
const SUFFIX_SYMBOLS = { UZS: "so'm" }

export function formatPrice(amount, currency = DEFAULT_CURRENCY, locale = 'en-US') {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—'
  const code = currency || DEFAULT_CURRENCY
  const value = Number(amount)
  const maximumFractionDigits = value % 1 === 0 ? 0 : 2
  const suffix = SUFFIX_SYMBOLS[code]

  if (suffix) {
    // Non-breaking spaces so a long so'm amount never wraps mid-number.
    const digits = new Intl.NumberFormat(locale, { maximumFractionDigits })
      .format(value)
      .replace(/,/g, ' ')
    return `${digits} ${suffix}`
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits,
  }).format(value)
}

export function formatPriceRange(from, to, currency = DEFAULT_CURRENCY) {
  if (from && to && from !== to) return `${formatPrice(from, currency)} – ${formatPrice(to, currency)}`
  return formatPrice(from ?? to, currency)
}
