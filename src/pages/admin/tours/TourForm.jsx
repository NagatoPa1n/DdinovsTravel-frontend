import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import MediaGrid from '@/components/media/MediaGrid'
import MediaUploader from '@/components/media/MediaUploader'
import { useMedia } from '@/hooks/useMedia'
import { destinationApi } from '@/features/destinations/destinationApi'
import { categoryApi } from '@/features/categories/categoryApi'
import { CURRENCIES } from '@/utils/formatPrice'
import {
  TOUR_STATUSES,
  emptyItineraryDay,
  emptyTour,
  normalizeItinerary,
  slugFromTitle,
} from '@/features/tours/tourUtils'
import { validate, required, positiveNumber } from '@/utils/validation'

const RULES = {
  title: [required()],
  price: [required(), positiveNumber()],
  days: [required(), positiveNumber()],
  // The API rejects a tour with no destination, so catch it here rather than
  // letting the save fail with a generic "Validation failed".
  destinationId: [required('Choose a destination')],
}

/** Shared create/edit form. `initial` seeds the fields; `onSubmit` receives raw form state. */
export default function TourForm({ initial, onSubmit, submitting, submitLabel = 'Save tour' }) {
  const [form, setForm] = useState(() => ({ ...emptyTour(), ...initial }))
  const [errors, setErrors] = useState({})
  const [picker, setPicker] = useState(null) // 'cover' | 'gallery' | null
  const [destinations, setDestinations] = useState([])
  const [categories, setCategories] = useState([])
  const media = useMedia({ limit: 24 })

  useEffect(() => {
    if (initial) setForm((prev) => ({ ...prev, ...initial }))
  }, [initial])

  useEffect(() => {
    destinationApi.list().then((data) => setDestinations(data?.items ?? data ?? [])).catch(() => {})
    categoryApi.list().then((data) => setCategories(data?.items ?? data ?? [])).catch(() => {})
  }, [])

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }))
  const change = (event) => {
    const { name, value, type, checked } = event.target
    set({ [name]: type === 'checkbox' ? checked : value })
  }

  const pickMedia = (item) => {
    if (picker === 'cover') {
      set({ coverImage: item })
      setPicker(null)
      return
    }
    if (picker === 'gallery') {
      set({ gallery: [...form.gallery.filter((m) => m.id !== item.id), item] })
    }
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validate(form, RULES)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit(form)
  }

  const listField = (name, label) => (
    <Input
      as="textarea"
      label={label}
      name={name}
      rows={4}
      hint="One item per line"
      value={(form[name] || []).join('\n')}
      onChange={(event) => set({ [name]: event.target.value.split('\n').filter(Boolean) })}
    />
  )

  return (
    <form className="form form--wide" onSubmit={submit} noValidate>
      <section className="panel">
        <h2>Basics</h2>
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={(event) => {
            const title = event.target.value
            const slugIsAuto = !form.slug || form.slug === slugFromTitle(form.title)
            set({ title, slug: slugIsAuto ? slugFromTitle(title) : form.slug })
          }}
          error={errors.title}
          required
        />
        <Input label="Slug" name="slug" value={form.slug} onChange={change} hint="Used in the public URL" />
        <Input as="textarea" label="Short summary" name="excerpt" rows={2} value={form.excerpt} onChange={change} />
        <Input
          as="textarea"
          label="Description"
          name="description"
          rows={8}
          value={form.description}
          onChange={change}
          hint="HTML is allowed"
        />
      </section>

      <section className="panel">
        <h2>Pricing and length</h2>
        <div className="grid-3">
          <Input label="Price" name="price" type="number" min="0" value={form.price} onChange={change} error={errors.price} required />
          <Input label="Discounted price" name="discountPrice" type="number" min="0" value={form.discountPrice ?? ''} onChange={change} />
          <Input as="select" label="Currency" name="currency" value={form.currency} onChange={change}>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </Input>
          <Input label="Days" name="days" type="number" min="1" value={form.days} onChange={change} error={errors.days} required />
          <Input label="Nights" name="nights" type="number" min="0" value={form.nights} onChange={change} />
          <Input label="Max group size" name="groupSize" type="number" min="1" value={form.groupSize} onChange={change} />
        </div>
      </section>

      <section className="panel">
        <h2>Classification</h2>
        <Input
          as="select"
          label="Destination"
          name="destinationId"
          value={form.destinationId}
          onChange={change}
          error={errors.destinationId}
          hint={destinations.length === 0 ? 'No destinations yet — create one first.' : undefined}
          required
        >
          <option value="">Select a destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>{destination.name}</option>
          ))}
        </Input>
        <fieldset className="checkbox-group">
          <legend>Categories</legend>
          {categories.length === 0 && <p className="muted">No categories yet.</p>}
          {categories.map((category) => (
            <label key={category.id}>
              <input
                type="checkbox"
                checked={form.categoryIds.includes(category.id)}
                onChange={(event) =>
                  set({
                    categoryIds: event.target.checked
                      ? [...form.categoryIds, category.id]
                      : form.categoryIds.filter((id) => id !== category.id),
                  })
                }
              />
              {category.name}
            </label>
          ))}
        </fieldset>
      </section>

      <section className="panel">
        <h2>Media</h2>
        <div className="media-slot">
          <div className="media-slot__preview">
            {form.coverImage?.url ? (
              <img src={form.coverImage.url} alt="" />
            ) : (
              <span className="muted">No cover image</span>
            )}
          </div>
          <div className="media-slot__actions">
            <Button type="button" variant="ghost" onClick={() => setPicker('cover')}>Choose cover</Button>
            {form.coverImage && (
              <Button type="button" variant="ghost" onClick={() => set({ coverImage: null })}>Remove</Button>
            )}
          </div>
        </div>

        <div className="gallery-slot">
          {form.gallery.map((item) => (
            <div key={item.id} className="gallery-slot__item">
              <img src={item.thumbnailUrl || item.url} alt="" />
              <button
                type="button"
                onClick={() => set({ gallery: form.gallery.filter((m) => m.id !== item.id) })}
              >
                Remove
              </button>
            </div>
          ))}
          <Button type="button" variant="ghost" onClick={() => setPicker('gallery')}>Add to gallery</Button>
        </div>
      </section>

      <section className="panel">
        <h2>Itinerary</h2>
        {form.itinerary.map((day, index) => (
          <div key={index} className="itinerary-row">
            <span className="itinerary-row__day">Day {day.day}</span>
            <Input
              name={`itinerary-title-${index}`}
              placeholder="Title"
              value={day.title}
              onChange={(event) =>
                set({
                  itinerary: form.itinerary.map((d, i) =>
                    i === index ? { ...d, title: event.target.value } : d
                  ),
                })
              }
            />
            <Input
              as="textarea"
              rows={2}
              name={`itinerary-description-${index}`}
              placeholder="What happens on this day"
              value={day.description}
              onChange={(event) =>
                set({
                  itinerary: form.itinerary.map((d, i) =>
                    i === index ? { ...d, description: event.target.value } : d
                  ),
                })
              }
            />
            <button
              type="button"
              className="link link--danger"
              onClick={() =>
                set({ itinerary: normalizeItinerary(form.itinerary.filter((_, i) => i !== index)) })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() => set({ itinerary: [...form.itinerary, emptyItineraryDay(form.itinerary.length)] })}
        >
          Add day
        </Button>
      </section>

      <section className="panel grid-2">
        {listField('included', 'What is included')}
        {listField('excluded', 'Not included')}
      </section>

      <section className="panel">
        <h2>Publishing</h2>
        <Input as="select" label="Status" name="status" value={form.status} onChange={change}>
          {TOUR_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </Input>
        <label className="checkbox">
          <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
          Show on the homepage
        </label>
        <Input label="SEO title" name="seoTitle" value={form.seoTitle} onChange={change} />
        <Input as="textarea" label="SEO description" name="seoDescription" rows={2} value={form.seoDescription} onChange={change} />
      </section>

      <div className="form__actions">
        <Button type="submit" loading={submitting} size="lg">{submitLabel}</Button>
      </div>

      <Modal open={Boolean(picker)} onClose={() => setPicker(null)} title="Media library" size="lg">
        <MediaUploader onUpload={media.upload} uploads={media.uploads} />
        <MediaGrid items={media.items} loading={media.loading} onSelect={pickMedia} />
      </Modal>
    </form>
  )
}
