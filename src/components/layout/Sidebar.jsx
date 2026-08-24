import { NavLink } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

const SECTIONS = [
  {
    title: 'Overview',
    links: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    title: 'Catalogue',
    links: [
      { to: '/admin/tours', label: 'Tours' },
      { to: '/admin/destinations', label: 'Destinations' },
      { to: '/admin/categories', label: 'Categories' },
    ],
  },
  {
    title: 'Content',
    links: [
      { to: '/admin/media', label: 'Media library' },
      { to: '/admin/pages', label: 'Pages' },
    ],
  },
  {
    title: 'Settings',
    links: [
      { to: '/admin/settings/general', label: 'General' },
      { to: '/admin/settings/contact', label: 'Contact' },
      { to: '/admin/settings/social', label: 'Social' },
      { to: '/admin/settings/profile', label: 'Profile' },
    ],
  },
]

export default function Sidebar({ open }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <Logo className="sidebar__brand-mark" />
        Ddinovs Admin
      </div>
      <nav className="sidebar__nav">
        {SECTIONS.map((section) => (
          <div key={section.title} className="sidebar__section">
            <h3>{section.title}</h3>
            {section.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
