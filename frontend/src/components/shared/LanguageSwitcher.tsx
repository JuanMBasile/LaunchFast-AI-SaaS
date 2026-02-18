import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

function FlagUS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" rx="1" fill="#fff" />
      <path fill="#B22234" d="M0 0h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0z" />
      <rect width="9.6" height="8.62" fill="#3C3B6E" />
    </svg>
  );
}

function FlagES({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" rx="1" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </svg>
  );
}

const LOCALES = [
  { code: 'en' as const, label: 'EN', Flag: FlagUS },
  { code: 'es' as const, label: 'ES', Flag: FlagES },
];

function getCurrentLocale(lng: string) {
  return LOCALES.find((l) => lng === l.code || lng.startsWith(l.code)) || LOCALES[0]!;
}

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getCurrentLocale(i18n.language);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30',
          compact && 'px-2 py-1',
        )}
        aria-label="Select language"
        aria-expanded={open}
      >
        <current.Flag className="w-5 h-3.5 shrink-0 rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]" />
        <span>{current.label}</span>
        <ChevronDown className={cn('h-3 w-3 text-stone-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg shadow-stone-900/5 animate-in fade-in slide-in-from-top-1">
          {LOCALES.map(({ code, label, Flag }) => (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                current.code === code
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-stone-600 hover:bg-stone-50',
              )}
            >
              <Flag className="w-5 h-3.5 shrink-0 rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]" />
              <span>{label === 'EN' ? 'English' : 'Espanol'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
