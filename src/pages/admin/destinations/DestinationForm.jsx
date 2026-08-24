import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import MediaGrid from '@/components/media/MediaGrid'
import MediaUploader from '@/components/media/MediaUploader'
import { useMedia } from '@/hooks/useMedia'
import { validate, required, slugify } from '@/utils/validation'

const RULES = { name: [required()] }

export const emptyDestination = () => ({
  name: '',
  slug: '',
  country: '',
  description: '',
  image: null,
  featured: false,
})

export default function DestinationForm({ initial, onSubmit, submitting, submitLabel = 'Save' }) {
  const [form, setForm] = useState(() => ({ ...emptyDestination(), ...initial }))
  const [errors, setErrors] = useState({})
  const [picking, setPicking] = useState(false)
  const media = useMedia({ type: 'image', limit: 24 })

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }))
  const change = (event) => {
    const { name, value, type, checked } = event.target
    set({ [name]: type === 'checkbox' ? checked : value })
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validate(form, RULES)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ ...form, slug: form.slug || slugify(form.name) })
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <section className="panel">
        <Input label="Name" name="name" value={form.name} onChange={change} error={errors.name} required />
        <Input label="Slug" name="slug" value={form.slug} onChange={change} hint="Leave blank to generate from the name" />
        <Input label="Country" name="country" value={form.country} onChange={change} />
        <Input as="textarea" label="Description" name="description" rows={6} value={form.description} onChange={change} hint="HTML is allowed" />
        <label className="checkbox">
          <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
          Feature on the homepage
        </label>
      </section>

      <section className="panel">
        <h2>Cover image</h2>
        <div className="media-slot">
          <div className="media-slot__preview">
            {form.image?.url ? <img src={form.image.url} alt="" /> : <span className="muted">No image</span>}
          </div>
          <div className="media-slot__actions">
            <Button type="button" variant="ghost" onClick={() => setPicking(true)}>Choose image</Button>
            {form.image && <Button type="button" variant="ghost" onClick={() => set({ image: null })}>Remove</Button>}
          </div>
        </div>
      </section>

      <div className="form__actions">
        <Button type="submit" loading={submitting} size="lg">{submitLabel}</Button>
      </div>

      <Modal open={picking} onClose={() => setPicking(false)} title="Media library" size="lg">
        <MediaUploader onUpload={media.upload} uploads={media.uploads} accept="image/*" />
        <MediaGrid
          items={media.items}
          loading={media.loading}
          onSelect={(item) => {
            set({ image: item })
            setPicking(false)
          }}
        />
      </Modal>
    </form>
  )
}
