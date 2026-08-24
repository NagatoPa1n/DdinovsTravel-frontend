/**
 * Languages offered by the site, in the order shown in the switcher.
 *
 * `code` is the storage key, the `<html lang>` value, and the flag name in <FlagIcon />.
 * `label` is written in the language itself — a switcher that names languages in a
 * language you cannot read is not much use.
 */
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', locale: 'en-US' },
  { code: 'uz', label: "O'zbekcha", short: 'UZ', locale: 'uz-UZ' },
  { code: 'ru', label: 'Русский', short: 'RU', locale: 'ru-RU' },
]

export const DEFAULT_LANGUAGE = 'en'

export const isSupported = (code) => LANGUAGES.some((language) => language.code === code)

export const findLanguage = (code) =>
  LANGUAGES.find((language) => language.code === code) || LANGUAGES[0]
