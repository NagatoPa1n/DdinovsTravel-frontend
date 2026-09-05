import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { tourApi } from '@/features/tours/tourApi'
import { api } from '@/services/api'
import { validate, required, phone as phoneRule } from '@/utils/validation'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Enquiry form for one tour.
 *
 * Posts to the same /contact endpoint the general form uses, with the tour carried in the
 * message body -- the agency reads enquiries in Telegram, where an extra line is all that
 * is needed to tell them apart. Only a name and a phone number are asked for: the agency
 * calls back, and every extra field is another reason to abandon the form.
 */
export default function TourEnquiry() {
  const { slug } = useParams()
  const toast = useToast()
  const { t, language } = useTranslation()
  const [tour, setTour] = useState(null)
  const [status, setStatus] = useState('loading')
  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let active = true
    setStatus('loading')
    tourApi
      .bySlug(slug)
      .then((data) => {
        if (!active) return
        setTour(data?.tour ?? data)
        setStatus('ready')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [slug, language])

  const change = (event) =>
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const rules = {
      name: [required(t('contact.required'))],
      phone: [required(t('contact.required')), phoneRule(t('contact.invalidPhone'))],
    }
    const found = validate(values, rules)
    setErrors(found)
    if (Object.keys(found).length) return

    setSending(true)
    try {
      await api.post('/contact', {
        name: values.name,
        phone: values.phone,
        message: `${t('enquiry.messagePrefix')}: ${tour.title}`,
      })
      setSent(true)
      toast.success(t('contact.sent'))
    } catch {
      toast.error(t('contact.failed'))
    } finally {
      setSending(false)
    }
  }

  if (status === 'loading') {
    return <div className="container section"><p className="state">{t('common.loading')}</p></div>
  }
  if (status === 'error' || !tour) {
    return (
      <div className="container section">
        <p className="state state--error">{t('tour.notFound')}</p>
        <Link to="/tours" className="link">{t('tour.back')}</Link>
      </div>
    )
  }

  return (
    <div className="container section enquiry">
      <header className="page-head">
        <h1>{t('enquiry.title')}</h1>
        <p>{t('enquiry.lead')}</p>
      </header>

      {sent ? (
        // The form is replaced rather than reset: leaving empty fields behind invites a
        // second identical enquiry from someone unsure whether the first one landed.
        <div className="enquiry__done">
          <p className="state state--success">{t('enquiry.thanks')}</p>
          <Button to={`/tours/${slug}`} variant="ghost">{t('enquiry.backToTour')}</Button>
        </div>
      ) : (
        <form className="form enquiry__form" onSubmit={submit} noValidate>
          <Input
            label={t('enquiry.tour')}
            name="tourTitle"
            value={tour.title}
            readOnly
            hint={t('enquiry.tourHint')}
          />
          <Input
            label={t('enquiry.fullName')}
            name="name"
            value={values.name}
            onChange={change}
            error={errors.name}
            autoComplete="name"
            required
          />
          <Input
            label={t('enquiry.phone')}
            name="phone"
            type="tel"
            value={values.phone}
            onChange={change}
            error={errors.phone}
            autoComplete="tel"
            required
          />
          <div className="form__actions">
            <Button type="submit" loading={sending} size="lg">{t('enquiry.send')}</Button>
            <Button to={`/tours/${slug}`} variant="ghost">{t('enquiry.cancel')}</Button>
          </div>
        </form>
      )}
    </div>
  )
}
