const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'tta_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Sort values the UI uses, translated to Spring Data's `property,direction`. */
const SORT_ALIASES = {
  newest: 'id,desc',
  oldest: 'id,asc',
}

/**
 * The API is Spring Data backed: pages are zero-indexed and the page size is `size`.
 * The UI counts pages from 1 and calls the size `limit`, so translate on the way out.
 */
function toQuery(params) {
  const query = {}

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (key === 'page') {
      query.page = Math.max(0, Number(value) - 1)
    } else if (key === 'limit') {
      query.size = value
    } else if (key === 'sort') {
      query.sort = SORT_ALIASES[value] || value
    } else {
      query[key] = value
    }
  })

  return query
}

function buildUrl(path, params) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  Object.entries(toQuery(params)).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

/** Every endpoint answers with `{ success, message, data, timestamp }`. */
function unwrap(body) {
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data
  }
  return body
}

/** Flattens a Spring Data page into the `{ items, meta }` shape the hooks read. */
function normalise(data) {
  if (data && typeof data === 'object' && Array.isArray(data.content) && 'totalPages' in data) {
    const size = data.size || data.content.length || 1
    return {
      items: data.content,
      meta: {
        page: (data.page ?? 0) + 1,
        limit: size,
        total: data.totalElements ?? data.content.length,
        pages: Math.max(1, data.totalPages ?? 1),
      },
    }
  }
  return data
}

/**
 * Language the API should answer in. Read from storage rather than React context
 * because this module is plain JS — LanguageProvider writes the same key.
 * The API ignores it for staff, who always receive the text as authored.
 */
function currentLanguage() {
  try {
    return localStorage.getItem('tta_lang') || ''
  } catch {
    return ''
  }
}

async function request(path, { method = 'GET', body, params, headers, signal } = {}) {
  const token = tokenStore.get()
  const isFormData = body instanceof FormData
  const language = currentLanguage()

  const response = await fetch(buildUrl(path, params), {
    method,
    signal,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(language ? { 'Accept-Language': language } : {}),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const payload = text ? safeParse(text) : null

  if (!response.ok) {
    if (response.status === 401) tokenStore.clear()
    // The envelope is kept intact on errors: callers read `.data.message`, and
    // validation failures arrive as a field map under `.data.data`.
    throw new ApiError(payload?.message || response.statusText, response.status, payload)
  }

  return normalise(unwrap(payload))
}

function safeParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Field-level validation errors from a failed request, keyed by field name.
 * The API reports them as `{ message: "Validation failed", data: { field: "reason" } }`.
 */
export function fieldErrors(error) {
  const details = error?.data?.data
  if (details && typeof details === 'object' && !Array.isArray(details)) {
    return details
  }
  return null
}

/**
 * Readable message for a failed request. Prefers the per-field reasons over the
 * generic envelope message, which on its own says only "Validation failed".
 */
export function apiErrorMessage(error, fallback = 'Something went wrong') {
  const details = fieldErrors(error)
  if (details) {
    const messages = Object.values(details).filter((value) => typeof value === 'string')
    if (messages.length) return messages.join(' · ')
  }
  return error?.data?.message || error?.message || fallback
}

export const api = {
  get: (path, params, options) => request(path, { ...options, params }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
