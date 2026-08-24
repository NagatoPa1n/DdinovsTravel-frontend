import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import SocialIcon from '@/components/ui/SocialIcon'
import { pageApi } from '@/features/pages/pageApi'
import { SOCIAL_NETWORKS as NETWORKS } from '@/features/pages/socialNetworks'
import { isUrl } from '@/utils/validation'

export default function SocialSettings() {
  const toast = useToast()
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    pageApi
      .getSettings('social')
      .then((data) => setForm(data?.settings ?? data ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const change = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const found = {}
    NETWORKS.forEach(({ key, label }) => {
      if (form[key] && !isUrl(form[key])) found[key] = `Enter a full ${label} URL`
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      await pageApi.updateSettings('social', form)
      toast.success('Social links saved')
    } catch {
      toast.error('Could not save social links')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state">Loading settings…</p>

  return (
    <>
      <header className="admin-head">
        <h1>Social links</h1>
      </header>
      <form className="form" onSubmit={submit} noValidate>
        <section className="panel">
          <p className="muted">
            Links left blank are hidden on the public site.
          </p>
          {NETWORKS.map((network) => (
            <div key={network.key} className="social-field">
              <SocialIcon network={network.key} size={22} />
              <Input
                label={network.label}
                name={network.key}
                value={form[network.key] || ''}
                onChange={change}
                error={errors[network.key]}
                placeholder="https://"
              />
            </div>
          ))}
        </section>
        <div className="form__actions">
          <Button type="submit" loading={saving}>Save links</Button>
        </div>
      </form>
    </>
  )
}
