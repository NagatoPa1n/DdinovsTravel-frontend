import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validate, required, slugify } from '@/utils/validation'

const RULES = { name: [required()] }
const empty = { name: '', slug: '', description: '' }

export default function CategoryForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({ ...empty, ...initial })
    setErrors({})
  }, [initial])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const found = validate(form, RULES)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ ...form, slug: form.slug || slugify(form.name) })
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <Input label="Name" name="name" value={form.name} onChange={change} error={errors.name} required />
      <Input label="Slug" name="slug" value={form.slug} onChange={change} hint="Leave blank to generate from the name" />
      <Input as="textarea" label="Description" name="description" rows={3} value={form.description} onChange={change} />
      <div className="form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{initial?.id ? 'Save changes' : 'Create category'}</Button>
      </div>
    </form>
  )
}
