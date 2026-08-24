import VideoPreview from './VideoPreview'

const isVideo = (item) => (item?.type || item?.mimeType || '').includes('video')

export default function MediaCard({ item, selected, onSelect, onDelete }) {
  return (
    <figure className={`media-card ${selected ? 'is-selected' : ''}`}>
      <button type="button" className="media-card__thumb" onClick={() => onSelect?.(item)}>
        {isVideo(item) ? (
          <VideoPreview src={item.url} poster={item.thumbnailUrl} />
        ) : (
          <img src={item.thumbnailUrl || item.url} alt={item.alt || item.filename || ''} loading="lazy" />
        )}
      </button>
      <figcaption className="media-card__meta">
        <span className="media-card__name" title={item.filename}>
          {item.filename}
        </span>
        {onDelete && (
          <button
            type="button"
            className="media-card__delete"
            onClick={() => onDelete(item)}
            aria-label={`Delete ${item.filename}`}
          >
            Delete
          </button>
        )}
      </figcaption>
    </figure>
  )
}
