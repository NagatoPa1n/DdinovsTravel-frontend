const TONE_BY_STATUS = {
  published: 'success',
  active: 'success',
  draft: 'muted',
  archived: 'muted',
  pending: 'warning',
  error: 'danger',
}

export default function Badge({ tone, status, children }) {
  const resolved = tone || TONE_BY_STATUS[status] || 'muted'
  return <span className={`badge badge--${resolved}`}>{children ?? status}</span>
}
