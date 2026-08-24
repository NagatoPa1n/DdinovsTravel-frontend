import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DestinationForm from './DestinationForm'
import { useToast } from '@/components/ui/Toast'
import { destinationApi } from '@/features/destinations/destinationApi'

export default function CreateDestination() {
  const navigate = useNavigate()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await destinationApi.create(payload)
      toast.success('Destination created')
      navigate('/admin/destinations', { replace: true })
    } catch (error) {
      toast.error(error.data?.message || 'Could not create the destination')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/destinations" className="link">← Destinations</Link>
          <h1>New destination</h1>
        </div>
      </header>
      <DestinationForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create destination" />
    </>
  )
}
