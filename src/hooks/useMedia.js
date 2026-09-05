import { useCallback, useEffect, useState } from 'react'
import { mediaApi } from '@/features/media/mediaApi'
import { uploadFile } from '@/services/upload'

export function useMedia({ type = '', search = '', page = 1, limit = 24 } = {}) {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploads, setUploads] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await mediaApi.list({ type, search, page, limit })
      setItems(data?.items ?? data ?? [])
      setMeta(data?.meta ?? { page: 1, pages: 1, total: (data?.items ?? data ?? []).length })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [type, search, page, limit])

  useEffect(() => {
    load()
  }, [load])

  /**
   * Uploads a batch, keeping whatever succeeded.
   *
   * One rejected file used to throw straight out of the loop, so the files after it were
   * never attempted and its progress row was left behind forever — with nothing shown to
   * explain any of it. Failures are collected and returned instead, for the caller to
   * report.
   */
  const upload = useCallback(async (files) => {
    const uploaded = []
    const failed = []
    for (const file of Array.from(files)) {
      try {
        const result = await uploadFile(file, {
          onProgress: (percent) => setUploads((prev) => ({ ...prev, [file.name]: percent })),
        })
        uploaded.push(result?.media ?? result)
      } catch (err) {
        failed.push({ file, error: err })
      } finally {
        setUploads((prev) => {
          const next = { ...prev }
          delete next[file.name]
          return next
        })
      }
    }
    if (uploaded.length) setItems((prev) => [...uploaded, ...prev])
    return { uploaded, failed }
  }, [])

  const remove = useCallback(async (id) => {
    await mediaApi.remove(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, meta, loading, error, uploads, upload, remove, reload: load }
}
