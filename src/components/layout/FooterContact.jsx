import { useEffect, useState } from 'react'
import { pageApi } from '@/features/pages/pageApi'

/**
 * Main phone number and email in the footer, read from Settings → Contact.
 *
 * Plain text, deliberately: the Contact page carries the dialable and mailable versions,
 * along with the address and the second number. Blank fields are skipped and the whole
 * block disappears when neither is set, so an unset site shows no empty rows.
 */
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

  if (!details.phone && !details.email) return null

  return (
    <ul className="footer-contact">
      {details.phone && <li>{details.phone}</li>}
      {details.email && <li>{details.email}</li>}
    </ul>
  )
}
