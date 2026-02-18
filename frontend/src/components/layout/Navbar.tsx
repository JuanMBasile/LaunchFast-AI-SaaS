import { Link } from 'react-router';
import { Rocket, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LanguageSwitcher from '../shared/LanguageSwitcher';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary-600/20">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              LaunchFast <span className="text-primary-600">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/pricing"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              {t('nav.pricing')}
            </Link>
            <div className="h-4 w-px bg-stone-200" />
            <LanguageSwitcher />
            {user ? (
              <Link to="/dashboard">
                <Button size="sm">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.logIn')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{t('nav.getStarted')}</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 border-t border-stone-100">
            <div className="px-1 py-2">
              <LanguageSwitcher />
            </div>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-50"
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.pricing')}
            </Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    {t('nav.logIn')}
                  </Button>
                </Link>
                <Link to="/register" className="block" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">{t('nav.getStarted')}</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
