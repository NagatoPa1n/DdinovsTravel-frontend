import { useEffect, useState } from 'react'
import SocialIcon from '@/components/ui/SocialIcon'
import { pageApi } from '@/features/pages/pageApi'
import { SOCIAL_NETWORKS } from '@/features/pages/socialNetworks'

/**
 * Renders an icon per social link configured under Settings → Social.
 * Networks left blank are skipped, and the whole block disappears when none are set,
 * so an unconfigured site shows no empty row of icons.
 */
export default function SocialLinks({ className = '', size = 20 }) {
  const [links, setLinks] = useState({})

  useEffect(() => {
    let active = true
    pageApi
      .getSettings('social')
      .then((data) => {
        if (active) setLinks(data?.settings ?? data ?? {})
      })
      .catch(() => {
        // A settings failure must not take the footer down.
      })
    return () => {
      active = false
    }
  }, [])

  const configured = SOCIAL_NETWORKS.filter((network) => {
    const url = links[network.key]
    return typeof url === 'string' && url.trim() !== ''
  })

  if (configured.length === 0) return null

  return (
    <ul className={['social-links', className].filter(Boolean).join(' ')}>
      {configured.map((network) => (
        <li key={network.key}>
          <a
            href={links[network.key]}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={network.label}
            title={network.label}
          >
            <SocialIcon network={network.key} size={size} />
          </a>
        </li>
      ))}
    </ul>
  )
}
