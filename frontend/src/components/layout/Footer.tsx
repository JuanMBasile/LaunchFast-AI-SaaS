import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              LaunchFast <span className="text-primary-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} LaunchFast AI. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
