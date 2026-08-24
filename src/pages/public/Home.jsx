import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { tourApi } from '@/features/tours/tourApi'
import { destinationApi } from '@/features/destinations/destinationApi'
import { formatPrice } from '@/utils/formatPrice'
import { discountPercent, savedAmount, tourImage } from '@/features/tours/tourUtils'
import { useTranslation } from '@/hooks/useTranslation'

export default function Home() {
  const { t, duration, language } = useTranslation()
  const [tours, setTours] = useState([])
  const [destinations, setDestinations] = useState([])

  // Re-fetches on a language switch: the API translates the content it returns.
  useEffect(() => {
    tourApi.featured().then((data) => setTours(data?.items ?? data ?? [])).catch(() => {})
    destinationApi.list({ limit: 6 }).then((data) => setDestinations(data?.items ?? data ?? [])).catch(() => {})
  }, [language])

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow">{t('home.eyebrow')}</p>
          <h1>{t('home.title')}</h1>
          <p className="hero__lead">{t('home.lead')}</p>
          <div className="hero__actions">
            <Button to="/tours" size="lg">{t('home.browseTours')}</Button>
            <Button to="/destinations" variant="ghost" size="lg">
              {t('home.exploreDestinations')}
            </Button>
          </div>
        </div>
      </section>

      <section className="container section">
        <header className="section__head">
          <h2>{t('home.featured')}</h2>
          <Link to="/tours" className="link">{t('home.allTours')}</Link>
        </header>
        {tours.length === 0 ? (
          <p className="state">{t('home.featuredEmpty')}</p>
        ) : (
          <div className="card-grid">
            {tours.map((tour) => {
              const off = discountPercent(tour)
              const saved = savedAmount(tour)
              return (
                <Link key={tour.id} to={`/tours/${tour.slug}`} className="tour-card">
                  <div className="tour-card__media">
                    {tourImage(tour)?.url && (
                      <img src={tourImage(tour).url} alt={tour.title} loading="lazy" />
                    )}
                    {off > 0 && <span className="tour-card__discount">-{off}%</span>}
                  </div>
                  <div className="tour-card__body">
                    <h3>{tour.title}</h3>
                    <p className="tour-card__meta">{duration(tour.days, tour.nights)}</p>
                    <p className="tour-card__price">
                      {formatPrice(tour.discountPrice || tour.price, tour.currency)}
                      <span className="tour-card__unit">{t('tour.perPerson')}</span>
                    </p>
                    {saved > 0 && (
                      <p className="tour-card__saving">
                        {t('tour.save', { amount: formatPrice(saved, tour.currency) })}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="container section">
        <header className="section__head">
          <h2>{t('home.destinations')}</h2>
          <Link to="/destinations" className="link">{t('home.allDestinations')}</Link>
        </header>
        {destinations.length === 0 ? (
          <p className="state">{t('home.destinationsEmpty')}</p>
        ) : (
          <div className="card-grid card-grid--tight">
            {destinations.map((destination) => (
              <Link key={destination.id} to={`/destinations/${destination.slug}`} className="destination-card">
                {destination.image?.url && <img src={destination.image.url} alt={destination.name} loading="lazy" />}
                <span>{destination.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
