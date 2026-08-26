import { useEffect, useState } from 'react'
import { pageApi } from '@/features/pages/pageApi'

/**
 * Main phone number and email in the footer, read from Settings → Contact.
 *
 * Plain text, deliberately: the Contact page carries the dialable and mailable versions,
 * along with the address and the second number. A blank email is skipped, so an unset
 * site shows no empty row.
 *
 * The phone falls back to the agency's own number rather than vanishing: a travel site
 * with no way to reach it is worse than one showing a number the admin has not yet
 * re-entered. Setting a phone in Settings > Contact overrides this, so the number is
 * never printed twice.
 */
const FALLBACK_PHONE = '+998 99 555 01 04'

export default function FooterContact() {
  const [details, setDetails] = useState({})

  useEffect(() => {
    let active = true
    pageApi
      .getSettings('contact')
      .then((data) => {
        if (active) setDetails(data?.settings ?? data ?? {})
      })
      .catch(() => {
        // A settings failure must not take the footer down.
      })
    return () => {
      active = false
    }
  }, [])

  const phone = details.phone || FALLBACK_PHONE

  return (
    <ul className="footer-contact">
      <li>{phone}</li>
      {details.email && <li>{details.email}</li>}
    </ul>
  )
}
