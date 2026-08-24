function pageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1])
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
}

export default function Pagination({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null
  const numbers = pageNumbers(page, pages)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      {numbers.map((number, index) => (
        <span key={number} className="pagination__slot">
          {index > 0 && numbers[index - 1] !== number - 1 && (
            <span className="pagination__gap">…</span>
          )}
          <button
            type="button"
            className={number === page ? 'is-active' : ''}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        </span>
      ))}
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  )
}
