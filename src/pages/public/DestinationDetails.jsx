import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { destinationApi } from '@/features/destinations/destinationApi'
import { tourApi } from '@/features/tours/tourApi'
import { formatPrice } from '@/utils/formatPrice'
import { tourImage } from '@/features/tours/tourUtils'
import { formatDateRange } from '@/utils/formatDate'
import { useTranslation } from '@/hooks/useTranslation'

export default function DestinationDetails() {
  const { slug } = useParams()
  const { t, duration, language, locale } = useTranslation()
  const [destination, setDestination] = useState(null)
  const [tours, setTours] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    destinationApi
      .bySlug(slug)
      .then((data) => {
        if (!active) return
        const record = data?.destination ?? data
        setDestination(record)
        setStatus('ready')
        return tourApi.list({ destination: record?.slug || slug, status: 'published' })
      })
      .then((data) => active && setTours(data?.items ?? data ?? []))
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [slug, language])

  if (status === 'loading') {
    return <div className="container section"><p className="state">{t('common.loading')}</p></div>
  }
  if (status === 'error' || !destination) {
    return (
      <div className="container section">
        <p className="state state--error">{t('destination.notFound')}</p>
        <Link to="/destinations" className="link">{t('destination.back')}</Link>
      </div>
    )
  }

  return (
    <div>
      <header className="destination-hero">
        {destination.image?.url && <img src={destination.image.url} alt={destination.name} />}
        <div className="container">
          <h1>{destination.name}</h1>
          {destination.country && <p>{destination.country}</p>}
        </div>
      </header>

      <div className="container section">
        {destination.description && (
          <div className="prose" dangerouslySetInnerHTML={{ __html: destination.description }} />
        )}

        <h2 className="section__head">{t('destination.toursIn', { name: destination.name })}</h2>
        {tours.length === 0 ? (
          <p className="state">{t('destination.empty')}</p>
        ) : (
          <div className="card-grid">
            {tours.map((tour) => {
              const dates = formatDateRange(tour.startDate, tour.endDate, locale)
              return (
                <Link key={tour.id} to={`/tours/${tour.slug}`} className="tour-card">
                  <div className="tour-card__media">
                    {tourImage(tour)?.url && (
                      <img src={tourImage(tour).url} alt={tour.title} loading="lazy" />
                    )}
                  </div>
                  <div className="tour-card__body">
                    <h3>{tour.title}</h3>
                    <p className="tour-card__meta">{duration(tour.days, tour.nights)}</p>
                    {dates && <p className="tour-card__dates">{dates}</p>}
                    <p className="tour-card__price">{formatPrice(tour.discountPrice || tour.price, tour.currency)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
