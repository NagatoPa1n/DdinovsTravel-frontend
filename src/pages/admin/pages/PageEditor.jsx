import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { pageApi } from '@/features/pages/pageApi'
import { validate, required } from '@/utils/validation'

const RULES = { title: [required()] }

export default function PageEditor() {
  const { slug } = useParams()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', body: '', seoTitle: '', seoDescription: '', status: 'published' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    pageApi
      .bySlug(slug)
      .then((data) => active && setForm((prev) => ({ ...prev, ...(data?.page ?? data ?? {}) })))
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [slug])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const found = validate(form, RULES)
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      await pageApi.update(slug, form)
      toast.success('Page saved')
    } catch (error) {
      toast.error(error.data?.message || 'Could not save the page')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state">Loading page…</p>

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/pages" className="link">← Pages</Link>
          <h1>{form.title || slug}</h1>
        </div>
      </header>

      <form className="form" onSubmit={submit} noValidate>
        <section className="panel">
          <Input label="Title" name="title" value={form.title} onChange={change} error={errors.title} required />
          <Input as="textarea" label="Body" name="body" rows={16} value={form.body} onChange={change} hint="HTML is allowed" />
        </section>

        <section className="panel">
          <h2>SEO</h2>
          <Input label="SEO title" name="seoTitle" value={form.seoTitle} onChange={change} />
          <Input as="textarea" label="SEO description" name="seoDescription" rows={2} value={form.seoDescription} onChange={change} />
          <Input as="select" label="Status" name="status" value={form.status} onChange={change}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Input>
        </section>

        <div className="form__actions">
          <Button type="submit" loading={saving} size="lg">Save page</Button>
        </div>
      </form>
    </>
  )
}
