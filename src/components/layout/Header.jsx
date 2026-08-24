import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'

const LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/tours', key: 'nav.tours' },
  { to: '/destinations', key: 'nav.destinations' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Logo className="brand__mark" />
          Ddinovs Travel
        </Link>

        <button
          type="button"
          className="site-header__burger"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {t(link.key)}
            </NavLink>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
