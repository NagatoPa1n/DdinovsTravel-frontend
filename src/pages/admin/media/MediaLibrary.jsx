import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Pagination from '@/components/ui/Pagination'
import MediaGrid from '@/components/media/MediaGrid'
import MediaUploader from '@/components/media/MediaUploader'
import { useToast } from '@/components/ui/Toast'
import { useMedia } from '@/hooks/useMedia'
import { mediaApi } from '@/features/media/mediaApi'
import { formatDate } from '@/utils/formatDate'

const formatSize = (bytes) => (bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : '—')

export default function MediaLibrary() {
  const toast = useToast()
  const [filters, setFilters] = useState({ type: '', search: '', page: 1, limit: 24 })
  const { items, meta, loading, uploads, upload, remove } = useMedia(filters)
  const [details, setDetails] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const patch = (next) => setFilters((prev) => ({ ...prev, page: 1, ...next }))

  const saveDetails = async () => {
    try {
      await mediaApi.update(details.id, { alt: details.alt, title: details.title })
      toast.success('Details saved')
      setDetails(null)
    } catch {
      toast.error('Could not save those details')
    }
  }

  const confirmDelete = async () => {
    try {
      await remove(pendingDelete.id)
      toast.success('File deleted')
      setPendingDelete(null)
      setDetails(null)
    } catch {
      toast.error('Could not delete that file')
    }
  }

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Media library</h1>
          <p className="muted">{meta.total} files</p>
        </div>
      </header>

      <MediaUploader onUpload={upload} uploads={uploads} />

      <div className="filters">
        <Input name="search" placeholder="Search files…" onChange={(event) => patch({ search: event.target.value })} />
        <Input as="select" name="type" onChange={(event) => patch({ type: event.target.value })}>
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Video</option>
        </Input>
      </div>

      <MediaGrid items={items} loading={loading} onSelect={setDetails} onDelete={setPendingDelete} />
      <Pagination page={meta.page} pages={meta.pages} onChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

      <Modal
        open={Boolean(details)}
        onClose={() => setDetails(null)}
        title="File details"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetails(null)}>Close</Button>
            <Button onClick={saveDetails}>Save</Button>
          </>
        }
      >
        {details && (
          <div className="media-details">
            <img src={details.thumbnailUrl || details.url} alt={details.alt || ''} />
            <dl>
              <div><dt>Filename</dt><dd>{details.filename}</dd></div>
              <div><dt>Size</dt><dd>{formatSize(details.size)}</dd></div>
              <div><dt>Uploaded</dt><dd>{formatDate(details.createdAt)}</dd></div>
              <div><dt>URL</dt><dd><a href={details.url} target="_blank" rel="noreferrer">{details.url}</a></dd></div>
            </dl>
            <Input
              label="Title"
              name="title"
              value={details.title || ''}
              onChange={(event) => setDetails({ ...details, title: event.target.value })}
            />
            <Input
              label="Alt text"
              name="alt"
              value={details.alt || ''}
              onChange={(event) => setDetails({ ...details, alt: event.target.value })}
              hint="Describes the image for screen readers"
            />
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete file"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Delete <strong>{pendingDelete?.filename}</strong>? Anywhere it is used will show a broken image.</p>
      </Modal>
    </>
  )
}
