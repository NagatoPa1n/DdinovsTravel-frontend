import { useEffect, useRef, useState } from 'react'
import FlagIcon from '@/components/ui/FlagIcon'
import { LANGUAGES, findLanguage } from '@/features/i18n/languages'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Flag + code trigger that opens the list of languages.
 * Not built on <Dropdown> because this needs a checked state per item and a flag
 * alongside each label.
 */
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = findLanguage(language)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('common.language')}
        title={t('common.language')}
      >
        <FlagIcon code={current.code} />
        <span className="lang__code">{current.short}</span>
        <span className="lang__caret" aria-hidden="true" />
      </button>

      {open && (
        <ul className="lang__menu" role="menu">
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={item.code === language}
                className={`lang__item ${item.code === language ? 'is-active' : ''}`}
                onClick={() => {
                  setLanguage(item.code)
                  setOpen(false)
                }}
              >
                <FlagIcon code={item.code} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
