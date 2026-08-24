import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TourForm from './TourForm'
import { useToast } from '@/components/ui/Toast'
import { tourApi } from '@/features/tours/tourApi'
import { apiErrorMessage } from '@/services/api'
import { toTourPayload } from '@/features/tours/tourUtils'

export default function CreateTour() {
  const navigate = useNavigate()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      const created = await tourApi.create(toTourPayload(form))
      toast.success('Tour created')
      navigate(`/admin/tours/${(created?.tour ?? created)?.id}/edit`, { replace: true })
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not create the tour'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/tours" className="link">← Tours</Link>
          <h1>New tour</h1>
        </div>
      </header>
      <TourForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create tour" />
    </>
  )
}
