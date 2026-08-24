/**
 * Flags for the language switcher, drawn inline at a 3:2 ratio.
 *
 * Simplified on purpose — at 20px the fine details of a real flag turn to mush, so each
 * mark keeps only what makes it recognisable at that size.
 */
const FLAGS = {
  // United Kingdom, standing in for English.
  en: (
    <>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3.4" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="5.4" />
      <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3.2" />
    </>
  ),

  uz: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5" fill="#0099B5" />
      <rect y="11" width="24" height="5" fill="#1EB53A" />
      <rect y="4.7" width="24" height="0.75" fill="#CE1126" />
      <rect y="10.55" width="24" height="0.75" fill="#CE1126" />
      {/* Crescent: a white disc with a blue disc offset over it. */}
      <circle cx="4" cy="2.5" r="1.7" fill="#fff" />
      <circle cx="4.95" cy="2.5" r="1.7" fill="#0099B5" />
      <circle cx="7.6" cy="1.5" r="0.42" fill="#fff" />
      <circle cx="7.6" cy="3.4" r="0.42" fill="#fff" />
      <circle cx="9.4" cy="1.5" r="0.42" fill="#fff" />
      <circle cx="9.4" cy="3.4" r="0.42" fill="#fff" />
    </>
  ),

  ru: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect y="5.33" width="24" height="5.34" fill="#0039A6" />
      <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
    </>
  ),
}

export default function FlagIcon({ code, size = 20, className = '', title }) {
  const flag = FLAGS[code]
  if (!flag) return null

  return (
    <svg
      className={['flag-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={(size * 2) / 3}
      viewBox="0 0 24 16"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {flag}
      {/* Hairline keeps the white-edged flags from bleeding into a light background. */}
      <rect
        x="0.4"
        y="0.4"
        width="23.2"
        height="15.2"
        rx="1.6"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.8"
      />
    </svg>
  )
}
