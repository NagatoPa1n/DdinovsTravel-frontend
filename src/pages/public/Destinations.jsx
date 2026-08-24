import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { destinationApi } from '@/features/destinations/destinationApi'
import { useTranslation } from '@/hooks/useTranslation'

export default function Destinations() {
  const { t, language } = useTranslation()
  const [destinations, setDestinations] = useState([])
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    destinationApi
      .list()
      .then((data) => {
        setDestinations(data?.items ?? data ?? [])
        setStatus('ready')
      })
      .catch(() => setStatus("error"))
  }, [language])

  return (
    <div className="container section">
      <header className="page-head">
        <h1>{t('destinations.title')}</h1>
        <p>{t('destinations.lead')}</p>
      </header>

      {status === 'loading' && <p className="state">{t('destinations.loading')}</p>}
      {status === 'error' && <p className="state state--error">{t('destinations.error')}</p>}
      {status === 'ready' && destinations.length === 0 && (
        <p className="state">{t('destinations.empty')}</p>
      )}

      <div className="card-grid">
        {destinations.map((destination) => (
          <Link key={destination.id} to={`/destinations/${destination.slug}`} className="destination-card destination-card--lg">
            {destination.image?.url && <img src={destination.image.url} alt={destination.name} loading="lazy" />}
            <div>
              <h2>{destination.name}</h2>
              {destination.country && <p className="muted">{destination.country}</p>}
              {destination.tourCount > 0 && (
                <p className="muted">{t('destinations.tourCount', { count: destination.tourCount })}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
