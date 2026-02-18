import { memo } from 'react';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

function CreditsIndicator() {
  const { credits } = useAuth();
  const { t } = useTranslation();

  if (!credits) return null;

  const percentage = credits.total > 0 ? (credits.remaining / credits.total) * 100 : 0;

  const barColor =
    percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200/80 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 px-3.5 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
        <Zap className="h-4 w-4 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{t('common.credits')}</span>
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {credits.remaining}/{credits.total}
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1">
          <div
            className={`${barColor} h-1 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CreditsIndicator);
