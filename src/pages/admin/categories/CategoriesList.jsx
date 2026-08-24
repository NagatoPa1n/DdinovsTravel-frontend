import { useCallback, useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Dropdown from '@/components/ui/Dropdown'
import CategoryForm from './CategoryForm'
import { useToast } from '@/components/ui/Toast'
import { categoryApi } from '@/features/categories/categoryApi'

export default function CategoriesList() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // category object, {} for new, null when closed
  const [submitting, setSubmitting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    categoryApi
      .list()
      .then((data) => setItems(data?.items ?? data ?? []))
      .catch(() => toast.error('Could not load categories'))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const save = async (payload) => {
    setSubmitting(true)
    try {
      if (editing?.id) await categoryApi.update(editing.id, payload)
      else await categoryApi.create(payload)
      toast.success(editing?.id ? 'Category updated' : 'Category created')
      setEditing(null)
      load()
    } catch (error) {
      toast.error(error.data?.message || 'Could not save the category')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await categoryApi.remove(pendingDelete.id)
      toast.success('Category deleted')
      setPendingDelete(null)
      load()
    } catch {
      toast.error('Could not delete that category')
    }
  }

  const columns = [
    { key: 'name', header: 'Category', render: (row) => <span className="table__primary">{row.name}</span> },
    { key: 'slug', header: 'Slug' },
    { key: 'tourCount', header: 'Tours', align: 'right', render: (row) => row.tourCount ?? 0 },
    {
      key: 'actions',
      header: '',
      width: 60,
      render: (row) => (
        <Dropdown
          trigger="⋯"
          align="right"
          items={[
            { key: 'edit', label: 'Edit', onSelect: () => setEditing(row) },
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
          <h1>Categories</h1>
          <p className="muted">Group tours by theme — hiking, culture, family, and so on.</p>
        </div>
        <Button onClick={() => setEditing({})}>New category</Button>
      </header>

      <Table columns={columns} rows={items} loading={loading} empty="No categories yet." />

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit category' : 'New category'}
      >
        <CategoryForm
          initial={editing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Delete <strong>{pendingDelete?.name}</strong>? Tours keep their other categories.</p>
      </Modal>
    </>
  )
}
