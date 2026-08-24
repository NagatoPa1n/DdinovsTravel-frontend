import { useEffect, useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import SocialLinks from '@/components/layout/SocialLinks'
import { pageApi } from '@/features/pages/pageApi'
import { api } from '@/services/api'
import { validate, required, email as emailRule, phone as phoneRule } from '@/utils/validation'
import { useTranslation } from '@/hooks/useTranslation'

/** Spaces and brackets are fine to read but not to dial. */
const telHref = (number) => `tel:${String(number).replace(/[^\d+]/g, '')}`

export default function Contact() {
  const toast = useToast()
  const { t, language } = useTranslation()
  const [details, setDetails] = useState({})
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  // Rebuilt per language so validation messages match the rest of the page.
  // Only name and phone are required: the agency calls back, so an email address and a
  // written message are optional. Email is still format-checked when one is given.
  const rules = useMemo(
    () => ({
      name: [required(t('contact.required'))],
      phone: [required(t('contact.required')), phoneRule(t('contact.invalidPhone'))],
      email: [emailRule(t('contact.invalidEmail'))],
    }),
    [t]
  )

  useEffect(() => {
    pageApi.getSettings('contact').then((data) => setDetails(data?.settings ?? data ?? {})).catch(() => {})
  }, [language])

  const change = (event) =>
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const found = validate(values, rules)
    setErrors(found)
    if (Object.keys(found).length) return

    setSending(true)
    try {
      await api.post('/contact', values)
      toast.success(t('contact.sent'))
      setValues({ name: '', email: '', phone: '', message: '' })
    } catch {
      toast.error(t('contact.failed'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container section contact">
      <div>
        <header className="page-head">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.lead')}</p>
        </header>

        <form className="form" onSubmit={submit} noValidate>
          <Input label={t('contact.name')} name="name" value={values.name} onChange={change} error={errors.name} required />
          <Input label={t('contact.phone')} name="phone" type="tel" value={values.phone} onChange={change} error={errors.phone} required />
          <Input label={t('contact.email')} name="email" type="email" value={values.email} onChange={change} error={errors.email} hint={t('contact.optional')} />
          <Input
            as="textarea"
            label={t('contact.message')}
            name="message"
            rows={6}
            value={values.message}
            onChange={change}
            error={errors.message}
            hint={t('contact.optional')}
          />
          <Button type="submit" loading={sending}>{t('contact.send')}</Button>
        </form>
      </div>

      <aside className="contact__details">
        <h2>{t('contact.getInTouch')}</h2>
        <dl>
          {details.email && <div><dt>{t('contact.email')}</dt><dd><a href={`mailto:${details.email}`}>{details.email}</a></dd></div>}
          {details.phone && (
            <div>
              <dt>{t('contact.phone')}</dt>
              <dd><a href={telHref(details.phone)}>{details.phone}</a></dd>
              {details.phone2 && <dd><a href={telHref(details.phone2)}>{details.phone2}</a></dd>}
            </div>
          )}
          {details.address && <div><dt>{t('contact.office')}</dt><dd>{details.address}</dd></div>}
          {details.hours && <div><dt>{t('contact.hours')}</dt><dd>{details.hours}</dd></div>}
        </dl>
        <SocialLinks className="social-links--lg" size={22} />
      </aside>
    </div>
  )
}
