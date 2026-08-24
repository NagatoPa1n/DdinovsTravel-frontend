import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import { LanguageProvider } from '@/features/i18n/LanguageContext'
import { ToastProvider } from '@/components/ui/Toast'

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
