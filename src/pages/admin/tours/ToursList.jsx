import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import Pagination from '@/components/ui/Pagination'
import { useToast } from '@/components/ui/Toast'
import { useTours } from '@/hooks/useTours'
import { tourApi } from '@/features/tours/tourApi'
import { formatPrice } from '@/utils/formatPrice'
import { formatDate, formatDateRange } from '@/utils/formatDate'
import { TOUR_STATUSES } from '@/features/tours/tourUtils'

export default function ToursList() {
  const navigate = useNavigate()
  const toast = useToast()
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, limit: 15 })
  const [pendingDelete, setPendingDelete] = useState(null)
  const { tours, meta, loading, reload } = useTours(filters)

  const patch = (next) => setFilters((prev) => ({ ...prev, page: 1, ...next }))

  const confirmDelete = async () => {
    try {
      await tourApi.remove(pendingDelete.id)
      toast.success(`"${pendingDelete.title}" deleted`)
      setPendingDelete(null)
      reload()
    } catch {
      toast.error('Could not delete that tour')
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Tour',
      render: (row) => (
        <Link to={`/admin/tours/${row.id}/edit`} className="table__primary">
          {row.title}
        </Link>
      ),
    },
    { key: 'destination', header: 'Destination', render: (row) => row.destination?.name || '—' },
    {
      key: 'dates',
      header: 'Dates',
      render: (row) => formatDateRange(row.startDate, row.endDate) || '—',
    },
    { key: 'price', header: 'Price', align: 'right', render: (row) => formatPrice(row.price, row.currency) },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
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
            { key: 'edit', label: 'Edit', onSelect: () => navigate(`/admin/tours/${row.id}/edit`) },
            { key: 'preview', label: 'Preview', onSelect: () => navigate(`/admin/tours/${row.id}/preview`) },
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
          <h1>Tours</h1>
          <p className="muted">{meta.total} total</p>
        </div>
        <Button to="/admin/tours/new">New tour</Button>
      </header>

      <div className="filters">
        <Input
          name="search"
          placeholder="Search tours…"
          onChange={(event) => patch({ search: event.target.value })}
        />
        <Input as="select" name="status" onChange={(event) => patch({ status: event.target.value })}>
          <option value="">All statuses</option>
          {TOUR_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </Input>
      </div>

      <Table columns={columns} rows={tours} loading={loading} empty="No tours yet." />
      <Pagination page={meta.page} pages={meta.pages} onChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete tour"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>
          Delete <strong>{pendingDelete?.title}</strong>? This cannot be undone.
        </p>
      </Modal>
    </>
  )
}
