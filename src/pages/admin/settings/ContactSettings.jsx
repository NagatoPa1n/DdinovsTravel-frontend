import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { pageApi } from '@/features/pages/pageApi'
import { validate, email as emailRule } from '@/utils/validation'

const DEFAULTS = { email: '', phone: '', whatsapp: '', address: '', hours: '', mapEmbed: '' }
const RULES = { email: [emailRule()] }

export default function ContactSettings() {
  const toast = useToast()
  const [form, setForm] = useState(DEFAULTS)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    pageApi
      .getSettings('contact')
      .then((data) => setForm((prev) => ({ ...prev, ...(data?.settings ?? data ?? {}) })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const found = validate(form, RULES)
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      await pageApi.updateSettings('contact', form)
      toast.success('Contact details saved')
    } catch {
      toast.error('Could not save contact details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state">Loading settings…</p>

  return (
    <>
      <header className="admin-head">
        <h1>Contact details</h1>
      </header>
      <form className="form" onSubmit={submit} noValidate>
        <section className="panel">
          <div className="grid-2">
            <Input label="Email" name="email" type="email" value={form.email} onChange={change} error={errors.email} />
            <Input label="Phone" name="phone" value={form.phone} onChange={change} />
            <Input label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={change} />
            <Input label="Opening hours" name="hours" value={form.hours} onChange={change} />
          </div>
          <Input as="textarea" label="Address" name="address" rows={3} value={form.address} onChange={change} />
          <Input as="textarea" label="Map embed" name="mapEmbed" rows={3} value={form.mapEmbed} onChange={change} hint="Paste an iframe embed code" />
        </section>
        <div className="form__actions">
          <Button type="submit" loading={saving}>Save details</Button>
        </div>
      </form>
    </>
  )
}
