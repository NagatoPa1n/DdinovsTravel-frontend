import MediaCard from './MediaCard'

export default function MediaGrid({ items = [], loading, selectedIds = [], onSelect, onDelete }) {
  if (loading) return <p className="state">Loading media…</p>
  if (!items.length) return <p className="state">No media yet. Upload something to get started.</p>

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          selected={selectedIds.includes(item.id)}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
