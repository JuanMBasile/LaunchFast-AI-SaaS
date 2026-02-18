import { Link } from 'react-router';
import { Home, FileQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-stone-200/80 mb-6">
            <FileQuestion className="h-8 w-8 text-stone-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
            {t('common.notFoundTitle')}
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            {t('common.notFoundMessage')}
          </p>
          <Link to="/">
            <Button size="lg">
              <Home className="h-4 w-4 mr-2" />
              {t('common.backHome')}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
