import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TourForm from './TourForm'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useTour } from '@/hooks/useTours'
import { tourApi } from '@/features/tours/tourApi'
import { apiErrorMessage } from '@/services/api'
import { toTourPayload } from '@/features/tours/tourUtils'

export default function EditTour() {
  const { id } = useParams()
  const toast = useToast()
  const { tour, setTour, loading, error } = useTour(id)
  const [submitting, setSubmitting] = useState(false)

  const initial = useMemo(() => {
    if (!tour) return null
    return {
      ...tour,
      destinationId: tour.destinationId ?? tour.destination?.id ?? '',
      categoryIds: tour.categoryIds ?? (tour.categories || []).map((category) => category.id),
      gallery: tour.gallery ?? [],
      itinerary: tour.itinerary ?? [],
      included: tour.included ?? [],
      excluded: tour.excluded ?? [],
    }
  }, [tour])

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      const updated = await tourApi.update(id, toTourPayload(form))
      setTour(updated?.tour ?? updated ?? form)
      toast.success('Changes saved')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not save the tour'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="state">Loading tour…</p>
  if (error || !tour) return <p className="state state--error">Could not load that tour.</p>

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/tours" className="link">← Tours</Link>
          <h1>
            {tour.title} <Badge status={tour.status} />
          </h1>
        </div>
        <Button to={`/admin/tours/${id}/preview`} variant="ghost">Preview</Button>
      </header>
      <TourForm initial={initial} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
    </>
  )
}
