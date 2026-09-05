import { useRef, useState } from 'react'
import { MAX_UPLOAD_BYTES, formatBytes } from '@/services/upload'

const ACCEPT = 'image/*,video/*'

export default function MediaUploader({ onUpload, uploads = {}, accept = ACCEPT, multiple = true }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState([])

  /**
   * A rejected file used to throw past this handler and vanish, leaving the picker
   * looking like nothing had happened — the reason an over-limit PNG read as "PNG
   * uploads don't work". Every failure is surfaced here instead.
   */
  const handleFiles = async (files) => {
    if (!files?.length) return
    setBusy(true)
    setErrors([])
    try {
      const result = await onUpload?.(files)
      const failed = result?.failed ?? []
      setErrors(failed.map(({ error }) => error?.message || 'Upload failed'))
    } catch (err) {
      setErrors([err?.message || 'Upload failed'])
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const pending = Object.entries(uploads)

  return (
    <div
      className={`uploader ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
      <p className="uploader__hint">
        Drag files here, or{' '}
        <button type="button" className="link" onClick={() => inputRef.current?.click()} disabled={busy}>
          browse
        </button>
      </p>
      <p className="uploader__meta">Images and video up to {formatBytes(MAX_UPLOAD_BYTES)} each</p>

      {errors.length > 0 && (
        <ul className="uploader__errors">
          {errors.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}

      {pending.length > 0 && (
        <ul className="uploader__progress">
          {pending.map(([name, percent]) => (
            <li key={name}>
              <span>{name}</span>
              <progress value={percent} max="100" />
              <span>{percent}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
