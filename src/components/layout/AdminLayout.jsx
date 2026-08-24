import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dropdown from '@/components/ui/Dropdown'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-layout">
      <Sidebar open={sidebarOpen} />
      <div className="admin-layout__content">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__burger"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-topbar__spacer" />
          <Dropdown
            trigger={<span className="avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</span>}
            align="right"
            items={[
              { key: 'profile', label: 'Profile settings', onSelect: () => navigate('/admin/settings/profile') },
              { key: 'site', label: 'View site', onSelect: () => window.open('/', '_blank') },
              { key: 'logout', label: 'Log out', danger: true, onSelect: handleLogout },
            ]}
          />
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
