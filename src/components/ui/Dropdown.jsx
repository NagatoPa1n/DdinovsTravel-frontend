import { useEffect, useRef, useState } from 'react'

export default function Dropdown({ label, items = [], align = 'left', trigger }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {trigger ?? label}
        <span className="dropdown__caret" aria-hidden="true" />
      </button>
      {open && (
        <ul className={`dropdown__menu dropdown__menu--${align}`} role="menu">
          {items.map((item) => (
            <li key={item.key ?? item.label}>
              <button
                type="button"
                role="menuitem"
                className={`dropdown__item ${item.danger ? 'is-danger' : ''}`}
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
