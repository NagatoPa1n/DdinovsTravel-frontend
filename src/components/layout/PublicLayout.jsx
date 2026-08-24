import { Link, Outlet } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import Header from './Header'
import FooterContact from './FooterContact'
import SocialLinks from './SocialLinks'
import { useTranslation } from '@/hooks/useTranslation'

export default function PublicLayout() {
  const { t } = useTranslation()

  return (
    <div className="public-layout">
      <Header />
      <main className="public-layout__main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <div className="brand brand--footer">
              <Logo className="brand__mark" />
              Ddinovs Travel
            </div>
            <p className="site-footer__tagline">{t('footer.tagline')}</p>
            <FooterContact />
            <SocialLinks />
          </div>
          <nav className="site-footer__links">
            <Link to="/tours">{t('nav.tours')}</Link>
            <Link to="/destinations">{t('nav.destinations')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
          </nav>
        </div>
        <div className="container site-footer__legal">
          <span>
            © {new Date().getFullYear()} Ddinovs Travel. {t('footer.rights')}
          </span>
          <Link to="/admin/login">{t('footer.admin')}</Link>
        </div>
      </footer>
    </div>
  )
}
