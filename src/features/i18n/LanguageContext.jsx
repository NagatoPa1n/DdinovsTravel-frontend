import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANGUAGE, findLanguage, isSupported } from './languages'
import { DURATION_UNITS, TRANSLATIONS } from './translations'

export const LanguageContext = createContext(null)

const STORAGE_KEY = 'tta_lang'

/**
 * Records the chosen language.
 *
 * services/api.js reads this key to set Accept-Language on every request, so it has to
 * be current *before* React re-renders. Child effects run ahead of the provider's own,
 * so a page that refetches on a language switch would otherwise send the language it
 * was showing a moment ago and render content one step behind the switcher.
 */
function persist(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage unavailable (private mode); the header is simply omitted.
  }
}

/** Remembered choice, else the browser's preference, else English. */
function initialLanguage() {
  let stored = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Ignored; fall through to the browser's preference.
  }

  const language = (stored && isSupported(stored) ? stored : null)
    ?? (navigator.languages || [navigator.language || ''])
      .map((tag) => String(tag).slice(0, 2).toLowerCase())
      .find(isSupported)
    ?? DEFAULT_LANGUAGE

  // Seeded here so the opening page's fetches are labelled too.
  persist(language)
  return language
}

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  )
}

/**
 * Picks the right plural form for `count`.
 * English takes one/other; Russian takes one/few/many; Uzbek has a single form.
 */
function pluralForm(forms, count, language) {
  if (forms.length === 1) return forms[0]

  if (language === 'ru') {
    const mod10 = count % 10
    const mod100 = count % 100
    if (mod10 === 1 && mod100 !== 11) return forms[0]
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
    return forms[2] ?? forms[1]
  }

  return count === 1 ? forms[0] : forms[1]
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((code) => {
    if (!isSupported(code)) return
    // Storage first: the refetch this triggers reads it for the Accept-Language header.
    persist(code)
    setLanguageState(code)
  }, [])

  const value = useMemo(() => {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE]
    const fallback = TRANSLATIONS[DEFAULT_LANGUAGE]

    /** Falls back to English, then to the key itself, so a gap never renders blank. */
    const t = (key, vars) =>
      interpolate(dictionary[key] ?? fallback[key] ?? key, vars)

    /** Localised "3 days / 2 nights". */
    const duration = (days, nights) => {
      if (!days) return '—'
      const units = DURATION_UNITS[language] || DURATION_UNITS[DEFAULT_LANGUAGE]
      const parts = [`${days} ${pluralForm(units.day, days, language)}`]
      if (nights) parts.push(`${nights} ${pluralForm(units.night, nights, language)}`)
      return parts.join(' / ')
    }

    return {
      language,
      setLanguage,
      t,
      duration,
      locale: findLanguage(language).locale,
    }
  }, [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
