/**
 * Ddinovs compass mark: a four-point star over two concentric rings,
 * anchored by a rounded square. Drawn in `currentColor` so it inherits
 * whatever the surrounding text colour is (accent on light, white on dark).
 */
export default function Logo({ size = 26, className = '', title }) {
  return (
    <svg
      className={['logo-mark', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      <circle cx="64" cy="64" r="37" stroke="currentColor" strokeWidth="3.4" />
      <circle cx="64" cy="64" r="30" stroke="currentColor" strokeWidth="3.4" />
      <path
        d="M64 3 Q67 61 125 64 Q67 67 64 125 Q61 67 3 64 Q61 61 64 3 Z"
        fill="currentColor"
      />
      <rect x="47" y="47" width="34" height="34" rx="7" fill="currentColor" />
    </svg>
  )
}
