import { useRef, useState } from 'react'

const ACCEPT = 'image/*,video/*'

export default function MediaUploader({ onUpload, uploads = {}, accept = ACCEPT, multiple = true }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleFiles = async (files) => {
    if (!files?.length) return
    setBusy(true)
    try {
      await onUpload?.(files)
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
      <p className="uploader__meta">Images and video up to 100 MB each</p>

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
