import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { pageApi } from '@/features/pages/pageApi'
import { CURRENCIES } from '@/utils/formatPrice'

const DEFAULTS = {
  siteName: 'Ddinovs Travel',
  tagline: '',
  defaultCurrency: 'USD',
  metaDescription: '',
  analyticsId: '',
}

export default function GeneralSettings() {
  const toast = useToast()
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    pageApi
      .getSettings('general')
      .then((data) => setForm((prev) => ({ ...prev, ...(data?.settings ?? data ?? {}) })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await pageApi.updateSettings('general', form)
      toast.success('Settings saved')
    } catch {
      toast.error('Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state">Loading settings…</p>

  return (
    <>
      <header className="admin-head">
        <h1>General settings</h1>
      </header>
      <form className="form" onSubmit={submit}>
        <section className="panel">
          <Input label="Site name" name="siteName" value={form.siteName} onChange={change} />
          <Input label="Tagline" name="tagline" value={form.tagline} onChange={change} />
          <Input as="select" label="Default currency" name="defaultCurrency" value={form.defaultCurrency} onChange={change}>
            {CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
          </Input>
        </section>
        <section className="panel">
          <h2>Search and analytics</h2>
          <Input as="textarea" label="Default meta description" name="metaDescription" rows={3} value={form.metaDescription} onChange={change} />
          <Input label="Analytics ID" name="analyticsId" value={form.analyticsId} onChange={change} hint="Leave blank to disable tracking" />
        </section>
        <div className="form__actions">
          <Button type="submit" loading={saving}>Save settings</Button>
        </div>
      </form>
    </>
  )
}
