import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { pageApi } from '@/features/pages/pageApi'
import { formatDate } from '@/utils/formatDate'

const BUILT_IN = [
  { slug: 'home', title: 'Home', editor: '/admin/pages/home' },
  { slug: 'about', title: 'About' },
  { slug: 'contact', title: 'Contact' },
]

export default function PagesList() {
  const toast = useToast()
  const [pages, setPages] = useState(BUILT_IN)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pageApi
      .list()
      .then((data) => {
        const remote = data?.items ?? data ?? []
        const merged = BUILT_IN.map((page) => ({
          ...page,
          ...remote.find((item) => item.slug === page.slug),
        }))
        const extra = remote.filter((item) => !BUILT_IN.some((page) => page.slug === item.slug))
        setPages([...merged, ...extra])
      })
      .catch(() => toast.error('Could not load pages'))
      .finally(() => setLoading(false))
  }, [toast])

  const columns = [
    {
      key: 'title',
      header: 'Page',
      render: (row) => (
        <Link to={row.editor || `/admin/pages/${row.slug}`} className="table__primary">
          {row.title}
        </Link>
      ),
    },
    { key: 'slug', header: 'Slug', render: (row) => `/${row.slug === 'home' ? '' : row.slug}` },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status || 'published'} /> },
    { key: 'updatedAt', header: 'Updated', render: (row) => formatDate(row.updatedAt) },
  ]

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Pages</h1>
          <p className="muted">Edit the copy on the public site.</p>
        </div>
      </header>
      <Table
        columns={columns}
        rows={pages}
        loading={loading}
        rowKey="slug"
      />
    </>
  )
}
