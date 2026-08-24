export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
export const isPhone = (value) => /^\+?[\d\s()-]{7,20}$/.test(String(value || '').trim())
export const isUrl = (value) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
export const isRequired = (value) =>
  Array.isArray(value) ? value.length > 0 : String(value ?? '').trim().length > 0

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/**
 * Runs a rules map against form values.
 * rules: { field: [ [predicate, message], ... ] }
 * Returns { field: message } for failures only.
 */
export function validate(values, rules) {
  const errors = {}
  Object.entries(rules).forEach(([field, checks]) => {
    for (const [predicate, message] of checks) {
      if (!predicate(values[field], values)) {
        errors[field] = message
        break
      }
    }
  })
  return errors
}

export const required = (message = 'This field is required') => [isRequired, message]
export const email = (message = 'Enter a valid email address') => [
  (v) => !v || isEmail(v),
  message,
]
export const minLength = (n, message) => [
  (v) => !v || String(v).length >= n,
  message || `Must be at least ${n} characters`,
]
export const positiveNumber = (message = 'Must be a number greater than 0') => [
  (v) => v === '' || v === undefined || (Number(v) > 0 && !Number.isNaN(Number(v))),
  message,
]
export const phone = (message = 'Enter a valid phone number') => [
  (v) => !v || isPhone(v),
  message,
]
