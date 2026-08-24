import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import { useToast } from '@/components/ui/Toast'
import { destinationApi } from '@/features/destinations/destinationApi'
import { formatDate } from '@/utils/formatDate'

export default function DestinationsList() {
  const navigate = useNavigate()
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    destinationApi
      .list()
      .then((data) => setItems(data?.items ?? data ?? []))
      .catch(() => toast.error('Could not load destinations'))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    try {
      await destinationApi.remove(pendingDelete.id)
      toast.success('Destination deleted')
      setPendingDelete(null)
      load()
    } catch {
      toast.error('Could not delete that destination')
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Destination',
      render: (row) => (
        <Link to={`/admin/destinations/${row.id}/edit`} className="table__primary">{row.name}</Link>
      ),
    },
    { key: 'country', header: 'Country', render: (row) => row.country || '—' },
    { key: 'tourCount', header: 'Tours', align: 'right', render: (row) => row.tourCount ?? 0 },
    { key: 'updatedAt', header: 'Updated', render: (row) => formatDate(row.updatedAt) },
    {
      key: 'actions',
      header: '',
      width: 60,
      render: (row) => (
        <Dropdown
          trigger="⋯"
          align="right"
          items={[
            { key: 'edit', label: 'Edit', onSelect: () => navigate(`/admin/destinations/${row.id}/edit`) },
            { key: 'delete', label: 'Delete', danger: true, onSelect: () => setPendingDelete(row) },
          ]}
        />
      ),
    },
  ]

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Destinations</h1>
          <p className="muted">{items.length} total</p>
        </div>
        <Button to="/admin/destinations/new">New destination</Button>
      </header>

      <Table columns={columns} rows={items} loading={loading} empty="No destinations yet." />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete destination"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Delete <strong>{pendingDelete?.name}</strong>? Tours linked to it will lose their destination.</p>
      </Modal>
    </>
  )
}
