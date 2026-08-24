import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Full-screen viewer for a set of images, opened from a gallery thumbnail.
 *
 * Kept separate from <Modal />: that one frames a titled panel with a header and padding,
 * which is the wrong shape for a photograph. Here the picture is the content, so the frame
 * gets out of the way.
 *
 * @param images  array of { url, alt } — the set to page through
 * @param index   which image is showing; -1 (or out of range) means closed
 * @param onIndex called with the new index when the viewer pages
 * @param onClose called when the viewer is dismissed
 */
export default function Lightbox({ images = [], index = -1, onIndex, onClose, label }) {
  const open = index >= 0 && index < images.length
  const count = images.length

  const step = useCallback(
    (delta) => {
      if (count === 0) return
      // Wraps, so paging past either end continues rather than dead-ends.
      onIndex?.((index + delta + count) % count)
    },
    [count, index, onIndex]
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, step])

  if (!open) return null

  const image = images[index]

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={label}>
      <div className="lightbox__backdrop" onClick={onClose} />

      <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close">
        &times;
      </button>

      {count > 1 && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => step(-1)}
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}

      <figure className="lightbox__figure">
        <img src={image.url} alt={image.alt || ''} />
        {count > 1 && (
          <figcaption className="lightbox__counter">
            {index + 1} / {count}
          </figcaption>
        )}
      </figure>

      {count > 1 && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          onClick={() => step(1)}
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}
    </div>,
    document.body
  )
}
