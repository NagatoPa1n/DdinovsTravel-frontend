import { useCallback, useEffect, useState } from 'react'
import { tourApi } from '@/features/tours/tourApi'

/** Fetches a paginated tour list and re-fetches whenever the filters change. */
export function useTours(params = {}) {
  const [tours, setTours] = useState([])
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const key = JSON.stringify(params)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await tourApi.list(JSON.parse(key), { signal })
      setTours(data?.items ?? data ?? [])
      setMeta(data?.meta ?? { page: 1, pages: 1, total: (data?.items ?? data ?? []).length })
    } catch (err) {
      if (err.name !== 'AbortError') setError(err)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  return { tours, meta, loading, error, reload: () => load() }
}

export function useTour(id) {
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    tourApi
      .byId(id)
      .then((data) => active && setTour(data?.tour ?? data))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  return { tour, setTour, loading, error }
}
