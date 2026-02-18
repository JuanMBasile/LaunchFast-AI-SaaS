import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export default function ThemeSwitcher({ compact, className }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-700',
        compact && 'px-2 py-1',
        className,
      )}
      aria-label={theme === 'dark' ? t('a11y.switchToLight') : t('a11y.switchToDark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400" aria-hidden />
      ) : (
        <Moon className="h-4 w-4 text-stone-500" aria-hidden />
      )}
    </button>
  );
}
