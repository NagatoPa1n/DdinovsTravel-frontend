import { useEffect, useState } from 'react'
import { pageApi } from '@/features/pages/pageApi'
import { useTranslation } from '@/hooks/useTranslation'

export default function About() {
  const { t, language } = useTranslation()
  const [page, setPage] = useState(null)

  useEffect(() => {
    pageApi
      .bySlug('about')
      .then((data) => setPage(data?.page ?? data ?? null))
      .catch(() => {})
  }, [language])

  // The CMS page wins when it exists; otherwise fall back to translated copy so the
  // page is never blank in any language.
  const title = page?.title || t('about.title')
  const body = page?.body || t('about.body')

  return (
    <div className="container section narrow">
      <header className="page-head">
        <h1>{title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  )
}
