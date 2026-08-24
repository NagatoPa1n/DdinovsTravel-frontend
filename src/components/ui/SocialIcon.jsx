/**
 * Brand marks for the social links, drawn inline so they inherit `currentColor`
 * and need no icon dependency.
 *
 * Networks without a dedicated glyph fall back to a neutral globe rather than an
 * approximated logo — a wrong-looking brand mark is worse than an honest generic one.
 */
const GLYPHS = {
  instagram: (
    <>
      <rect
        x="2.6"
        y="2.6"
        width="18.8"
        height="18.8"
        rx="5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </>
  ),

  telegram: (
    <path
      d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
      fill="currentColor"
    />
  ),

  facebook: (
    <path
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
      fill="currentColor"
    />
  ),

  youtube: (
    <path
      d="M23.5 6.5a3 3 0 0 0-2.12-2.13C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.38.51A3 3 0 0 0 .5 6.5C0 8.38 0 12 0 12s0 3.62.5 5.5a3 3 0 0 0 2.12 2.13c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51A3 3 0 0 0 23.5 17.5C24 15.62 24 12 24 12s0-3.62-.5-5.5zM9.6 15.57V8.43L15.87 12 9.6 15.57z"
      fill="currentColor"
    />
  ),

  tiktok: (
    <path
      d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .52.04.76.12v-3.1a5.66 5.66 0 0 0-.76-.05 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.28 1.37V7.3a4.28 4.28 0 0 1-3.22-1.48z"
      fill="currentColor"
    />
  ),

  x: (
    <path
      d="M18.9 2H22l-7.1 8.1L23.2 22h-6.5l-5.1-6.65L5.76 22H2.64l7.6-8.68L1.8 2h6.66l4.6 6.08L18.9 2zm-1.1 18.13h1.73L7.28 3.78H5.43l12.37 16.35z"
      fill="currentColor"
    />
  ),

  globe: (
    <>
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M2.8 12h18.4M12 2.8c2.4 2.5 3.6 5.6 3.6 9.2s-1.2 6.7-3.6 9.2c-2.4-2.5-3.6-5.6-3.6-9.2S9.6 5.3 12 2.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </>
  ),
}

export default function SocialIcon({ network, size = 20, className = '', title }) {
  return (
    <svg
      className={['social-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {GLYPHS[network] || GLYPHS.globe}
    </svg>
  )
}
