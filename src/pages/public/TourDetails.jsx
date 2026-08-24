import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { tourApi } from '@/features/tours/tourApi'
import { formatPrice } from '@/utils/formatPrice'
import { discountPercent, tourImage } from '@/features/tours/tourUtils'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Tour enquiries go straight to the agency's Telegram, not the contact form.
 * Deliberately not the footer's Settings → Social telegram link, which points at the
 * public channel (@ddinovstravel) rather than the account that answers enquiries.
 */
const TELEGRAM_ENQUIRY_URL = 'https://t.me/ddinovs'

export default function TourDetails() {
  const { slug } = useParams()
  const { t, duration, language } = useTranslation()
  const [tour, setTour] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    tourApi
      .bySlug(slug)
      .then((data) => {
        if (!active) return
        setTour(data?.tour ?? data)
        setStatus('ready')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [slug, language])

  if (status === 'loading') {
    return <div className="container section"><p className="state">{t('common.loading')}</p></div>
  }
  if (status === 'error' || !tour) {
    return (
      <div className="container section">
        <p className="state state--error">{t('tour.notFound')}</p>
        <Link to="/tours" className="link">{t('tour.back')}</Link>
      </div>
    )
  }

  const off = discountPercent(tour)

  return (
    <article className="tour-details">
      <header className="tour-details__hero">
        {tourImage(tour)?.url && <img src={tourImage(tour).url} alt={tour.title} />}
        <div className="container tour-details__hero-body">
          {tour.destination && <Badge tone="info">{tour.destination.name}</Badge>}
          <h1>{tour.title}</h1>
          <p>{tour.excerpt}</p>
        </div>
      </header>

      <div className="container tour-details__grid">
        <div className="tour-details__main">
          <section>
            <h2>{t('tour.about')}</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: tour.description || '' }} />
          </section>

          {tour.itinerary?.length > 0 && (
            <section>
              <h2>{t('tour.itinerary')}</h2>
              <ol className="itinerary">
                {tour.itinerary.map((day) => (
                  <li key={day.day}>
                    <span className="itinerary__day">{t('tour.day', { n: day.day })}</span>
                    <div>
                      <h3>{day.title}</h3>
                      <p>{day.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
            <section className="two-col">
              {tour.included?.length > 0 && (
                <div>
                  <h2>{t('tour.included')}</h2>
                  <ul className="check-list">
                    {tour.included.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
              {tour.excluded?.length > 0 && (
                <div>
                  <h2>{t('tour.notIncluded')}</h2>
                  <ul className="check-list check-list--negative">
                    {tour.excluded.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}

          {tour.gallery?.length > 0 && (
            <section>
              <h2>{t('tour.gallery')}</h2>
              <div className="gallery">
                {tour.gallery.map((media) => (
                  <img key={media.id} src={media.url} alt={media.alt || tour.title} loading="lazy" />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="tour-details__aside">
          <div className="booking-card">
            <p className="booking-card__price">
              {formatPrice(tour.discountPrice || tour.price, tour.currency)}
              {off > 0 && <s>{formatPrice(tour.price, tour.currency)}</s>}
            </p>
            <dl className="booking-card__facts">
              <div>
                <dt>{t('tour.duration')}</dt>
                <dd>{duration(tour.days, tour.nights)}</dd>
              </div>
              {tour.groupSize > 0 && (
                <div>
                  <dt>{t('tour.groupSize')}</dt>
                  <dd>{t('tour.upTo', { n: tour.groupSize })}</dd>
                </div>
              )}
              {tour.destination && (
                <div>
                  <dt>{t('tour.destination')}</dt>
                  <dd>{tour.destination.name}</dd>
                </div>
              )}
            </dl>
            <Button
              href={TELEGRAM_ENQUIRY_URL}
              target="_blank"
              rel="noreferrer noopener"
              size="lg"
              className="booking-card__cta"
            >
              {t('tour.enquire')}
            </Button>
          </div>
        </aside>
      </div>
    </article>
  )
}
