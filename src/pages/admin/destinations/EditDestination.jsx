import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DestinationForm from './DestinationForm'
import { useToast } from '@/components/ui/Toast'
import { destinationApi } from '@/features/destinations/destinationApi'

export default function EditDestination() {
  const { id } = useParams()
  const toast = useToast()
  const [destination, setDestination] = useState(null)
  const [status, setStatus] = useState('loading')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    destinationApi
      .byId(id)
      .then((data) => {
        if (!active) return
        setDestination(data?.destination ?? data)
        setStatus('ready')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const updated = await destinationApi.update(id, payload)
      setDestination(updated?.destination ?? updated ?? payload)
      toast.success('Changes saved')
    } catch (error) {
      toast.error(error.data?.message || 'Could not save the destination')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return <p className="state">Loading…</p>
  if (status === 'error' || !destination) return <p className="state state--error">Could not load that destination.</p>

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/destinations" className="link">← Destinations</Link>
          <h1>{destination.name}</h1>
        </div>
      </header>
      <DestinationForm
        initial={destination}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </>
  )
}
