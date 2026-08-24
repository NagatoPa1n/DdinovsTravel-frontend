import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { tourApi } from '@/features/tours/tourApi'
import { destinationApi } from '@/features/destinations/destinationApi'
import { mediaApi } from '@/features/media/mediaApi'
import { formatDate } from '@/utils/formatDate'

export default function Dashboard() {
  const [stats, setStats] = useState({ tours: 0, published: 0, destinations: 0, media: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    Promise.all([
      tourApi.list({ limit: 5, sort: 'newest' }).catch(() => null),
      tourApi.list({ status: 'published', limit: 1 }).catch(() => null),
      destinationApi.list({ limit: 1 }).catch(() => null),
      mediaApi.list({ limit: 1 }).catch(() => null),
    ]).then(([tours, published, destinations, media]) => {
      setRecent(tours?.items ?? tours ?? [])
      setStats({
        tours: tours?.meta?.total ?? (tours?.items ?? tours ?? []).length,
        published: published?.meta?.total ?? 0,
        destinations: destinations?.meta?.total ?? 0,
        media: media?.meta?.total ?? 0,
      })
    })
  }, [])

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">A quick look at the catalogue.</p>
        </div>
        <Button to="/admin/tours/new">New tour</Button>
      </header>

      <div className="stat-row">
        <div className="stat"><span>Tours</span><strong>{stats.tours}</strong></div>
        <div className="stat"><span>Published</span><strong>{stats.published}</strong></div>
        <div className="stat"><span>Destinations</span><strong>{stats.destinations}</strong></div>
        <div className="stat"><span>Media files</span><strong>{stats.media}</strong></div>
      </div>

      <section className="panel">
        <header className="panel__head">
          <h2>Recently updated tours</h2>
          <Link to="/admin/tours" className="link">View all</Link>
        </header>
        {recent.length === 0 ? (
          <p className="state">No tours yet. Create your first one.</p>
        ) : (
          <ul className="recent-list">
            {recent.map((tour) => (
              <li key={tour.id}>
                <Link to={`/admin/tours/${tour.id}/edit`}>{tour.title}</Link>
                <Badge status={tour.status} />
                <span className="muted">{formatDate(tour.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
