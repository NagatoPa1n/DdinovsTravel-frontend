import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import Badge from '@/components/ui/Badge'
import { useTours } from '@/hooks/useTours'
import { categoryApi } from '@/features/categories/categoryApi'
import { formatPrice } from '@/utils/formatPrice'
import { discountPercent, tourImage } from '@/features/tours/tourUtils'
import { formatDateRange } from '@/utils/formatDate'
import { useTranslation } from '@/hooks/useTranslation'

export default function Tours() {
  const { t, duration, language, locale } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [categories, setCategories] = useState([])

  // `lang` is part of the query so a language switch re-runs the fetch and the API
  // returns content translated into it.
  const query = useMemo(
    () => ({
      status: 'published',
      search: params.get('search') || '',
      category: params.get('category') || '',
      sort: params.get('sort') || 'newest',
      page: Number(params.get('page')) || 1,
      limit: 9,
      lang: language,
    }),
    [params, language]
  )

  const { tours, meta, loading, error } = useTours(query)

  useEffect(() => {
    categoryApi.list().then((data) => setCategories(data?.items ?? data ?? [])).catch(() => {})
  }, [language])

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    if (!('page' in patch)) next.delete('page')
    setParams(next)
  }

  return (
    <div className="container section">
      <header className="page-head">
        <h1>{t('tours.title')}</h1>
        <p>{meta.total ? t('tours.count', { count: meta.total }) : t('tours.browse')}</p>
      </header>

      <div className="filters">
        <Input
          name="search"
          placeholder={t('tours.searchPlaceholder')}
          defaultValue={query.search}
          onChange={(event) => update({ search: event.target.value })}
        />
        <Input
          as="select"
          name="category"
          value={query.category}
          onChange={(event) => update({ category: event.target.value })}
        >
          <option value="">{t('tours.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug || category.id}>
              {category.name}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          name="sort"
          value={query.sort}
          onChange={(event) => update({ sort: event.target.value })}
        >
          <option value="newest">{t('tours.sortNewest')}</option>
          <option value="price_asc">{t('tours.sortPriceAsc')}</option>
          <option value="price_desc">{t('tours.sortPriceDesc')}</option>
          <option value="duration">{t('tours.sortDuration')}</option>
        </Input>
      </div>

      {error && <p className="state state--error">{t('tours.error')}</p>}

      {loading ? (
        <p className="state">{t('tours.loading')}</p>
      ) : tours.length === 0 ? (
        <p className="state">{t('tours.empty')}</p>
      ) : (
        <div className="card-grid">
          {tours.map((tour) => {
            const off = discountPercent(tour)
            const dates = formatDateRange(tour.startDate, tour.endDate, locale)
            return (
              <Link key={tour.id} to={`/tours/${tour.slug}`} className="tour-card">
                <div className="tour-card__media">
                  {tourImage(tour)?.url && (
                    <img src={tourImage(tour).url} alt={tour.title} loading="lazy" />
                  )}
                  {off > 0 && <span className="tour-card__tag"><Badge tone="danger">-{off}%</Badge></span>}
                </div>
                <div className="tour-card__body">
                  <h3>{tour.title}</h3>
                  <p className="tour-card__meta">
                    {tour.destination?.name} · {duration(tour.days, tour.nights)}
                  </p>
                  {dates && <p className="tour-card__dates">{dates}</p>}
                  <p className="tour-card__excerpt">{tour.excerpt}</p>
                  <p className="tour-card__price">
                    {formatPrice(tour.discountPrice || tour.price, tour.currency)}
                    {off > 0 && <s>{formatPrice(tour.price, tour.currency)}</s>}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <Pagination page={meta.page} pages={meta.pages} onChange={(page) => update({ page })} />
    </div>
  )
}
