import { useContext } from 'react'
import { LanguageContext } from '@/features/i18n/LanguageContext'

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used inside a <LanguageProvider>')
  return context
}
