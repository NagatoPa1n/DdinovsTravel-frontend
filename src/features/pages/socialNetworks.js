/**
 * Social networks the site knows about, in the order they are rendered.
 *
 * Shared by the admin settings screen and the public footer so a network added here
 * shows up in both without further edits. The `key` is also the settings key stored
 * under the "social" group, and the icon name in <SocialIcon />.
 */
export const SOCIAL_NETWORKS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'x', label: 'X' },
  { key: 'tripadvisor', label: 'Tripadvisor' },
]
