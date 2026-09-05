import { Link, useParams } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useTour } from '@/hooks/useTours'
import { formatPrice } from '@/utils/formatPrice'
import { formatDateRange, formatDuration } from '@/utils/formatDate'

/** Renders the tour exactly as the public page would, including drafts. */
export default function TourPreview() {
  const { id } = useParams()
  const { tour, loading, error } = useTour(id)

  if (loading) return <p className="state">Loading preview…</p>
  if (error || !tour) return <p className="state state--error">Could not load that tour.</p>

  const dates = formatDateRange(tour.startDate, tour.endDate)

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to={`/admin/tours/${id}/edit`} className="link">← Back to editing</Link>
          <h1>Preview <Badge status={tour.status} /></h1>
        </div>
        {tour.status === 'published' && (
          <Button href={`/tours/${tour.slug}`} target="_blank" rel="noreferrer" variant="ghost">
            Open live page
          </Button>
        )}
      </header>

      <article className="panel preview">
        {tour.coverImage?.url && <img className="preview__cover" src={tour.coverImage.url} alt="" />}
        <h2>{tour.title}</h2>
        <p className="muted">
          {tour.destination?.name} · {formatDuration(tour.days, tour.nights)} ·{' '}
          {formatPrice(tour.discountPrice || tour.price, tour.currency)}
          {dates && <> · {dates}</>}
        </p>
        <p>{tour.excerpt}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: tour.description || '' }} />

        {tour.itinerary?.length > 0 && (
          <ol className="itinerary">
            {tour.itinerary.map((day) => (
              <li key={day.day}>
                <span className="itinerary__day">Day {day.day}</span>
                <div>
                  <h3>{day.title}</h3>
                  <p>{day.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </article>
    </>
  )
}
