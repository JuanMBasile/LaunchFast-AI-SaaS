import { Outlet, NavLink, useNavigate } from 'react-router';
import { Rocket, LayoutDashboard, Wand2, Clock, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import CreditsIndicator from '../shared/CreditsIndicator';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import ThemeSwitcher from '../shared/ThemeSwitcher';
import { cn } from '../../lib/utils';

const navKeys = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
  { to: '/dashboard/generator', icon: Wand2, labelKey: 'common.generator' },
  { to: '/dashboard/history', icon: Clock, labelKey: 'common.history' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary-600/20">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              LaunchFast <span className="text-primary-600">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher compact />
            <LanguageSwitcher compact />
          </div>
        </div>
        <CreditsIndicator />
      </div>

      <nav className="flex-1 px-3 space-y-0.5" role="navigation" aria-label={t('nav.dashboard')}>
        {navKeys.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-stone-200/60 dark:border-stone-700">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{user?.fullName}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all duration-150"
          aria-label={t('a11y.logOut')}
        >
          <LogOut className="h-4 w-4" />
          {t('common.logOut')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-stone-900 border-r border-stone-200/60 dark:border-stone-800">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-stone-900 shadow-xl">
            <button
              type="button"
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              onClick={() => setSidebarOpen(false)}
              aria-label={t('a11y.closeSidebar')}
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800 lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('a11y.openSidebar')}
            >
              <Menu className="h-5 w-5 text-stone-600 dark:text-stone-400" />
            </button>
            <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              LaunchFast <span className="text-primary-600">AI</span>
            </span>
            <div className="w-10" />
          </div>
        </header>

        <main className="p-5 lg:p-8 max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
