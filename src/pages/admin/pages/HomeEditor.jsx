import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import MediaGrid from '@/components/media/MediaGrid'
import MediaUploader from '@/components/media/MediaUploader'
import { useToast } from '@/components/ui/Toast'
import { useMedia } from '@/hooks/useMedia'
import { pageApi } from '@/features/pages/pageApi'

const DEFAULTS = {
  heroEyebrow: '',
  heroTitle: '',
  heroLead: '',
  heroImage: null,
  featuredTitle: 'Featured tours',
  featuredLimit: 6,
  destinationsTitle: 'Destinations',
  ctaTitle: '',
  ctaBody: '',
}

export default function HomeEditor() {
  const toast = useToast()
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [picking, setPicking] = useState(false)
  const media = useMedia({ type: 'image', limit: 24 })

  useEffect(() => {
    pageApi
      .bySlug('home')
      .then((data) => setForm((prev) => ({ ...prev, ...((data?.page ?? data)?.content ?? data ?? {}) })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await pageApi.update('home', { title: 'Home', content: form })
      toast.success('Homepage saved')
    } catch (error) {
      toast.error(error.data?.message || 'Could not save the homepage')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state">Loading homepage…</p>

  return (
    <>
      <header className="admin-head">
        <div>
          <Link to="/admin/pages" className="link">← Pages</Link>
          <h1>Homepage</h1>
        </div>
      </header>

      <form className="form" onSubmit={submit}>
        <section className="panel">
          <h2>Hero</h2>
          <Input label="Eyebrow" name="heroEyebrow" value={form.heroEyebrow} onChange={change} hint="Small line above the headline" />
          <Input label="Headline" name="heroTitle" value={form.heroTitle} onChange={change} />
          <Input as="textarea" label="Intro" name="heroLead" rows={3} value={form.heroLead} onChange={change} />
          <div className="media-slot">
            <div className="media-slot__preview">
              {form.heroImage?.url ? <img src={form.heroImage.url} alt="" /> : <span className="muted">No hero image</span>}
            </div>
            <div className="media-slot__actions">
              <Button type="button" variant="ghost" onClick={() => setPicking(true)}>Choose image</Button>
              {form.heroImage && (
                <Button type="button" variant="ghost" onClick={() => setForm((p) => ({ ...p, heroImage: null }))}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Sections</h2>
          <div className="grid-2">
            <Input label="Featured tours heading" name="featuredTitle" value={form.featuredTitle} onChange={change} />
            <Input label="How many to show" name="featuredLimit" type="number" min="3" max="12" value={form.featuredLimit} onChange={change} />
          </div>
          <Input label="Destinations heading" name="destinationsTitle" value={form.destinationsTitle} onChange={change} />
        </section>

        <section className="panel">
          <h2>Closing call to action</h2>
          <Input label="Heading" name="ctaTitle" value={form.ctaTitle} onChange={change} />
          <Input as="textarea" label="Body" name="ctaBody" rows={3} value={form.ctaBody} onChange={change} />
        </section>

        <div className="form__actions">
          <Button type="submit" loading={saving} size="lg">Save homepage</Button>
        </div>
      </form>

      <Modal open={picking} onClose={() => setPicking(false)} title="Media library" size="lg">
        <MediaUploader onUpload={media.upload} uploads={media.uploads} accept="image/*" />
        <MediaGrid
          items={media.items}
          loading={media.loading}
          onSelect={(item) => {
            setForm((prev) => ({ ...prev, heroImage: item }))
            setPicking(false)
          }}
        />
      </Modal>
    </>
  )
}
