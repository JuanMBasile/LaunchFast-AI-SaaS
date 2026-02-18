import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Clock, ArrowRight, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generationsApi } from '../api/generations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Generation, PaginatedResponse } from '../types';
import { formatDate } from '../lib/utils';

export default function History() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PaginatedResponse<Generation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const locale = i18n.resolvedLanguage || 'en';

  useEffect(() => {
    setLoading(true);
    generationsApi
      .getAll(page, 10)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">{t('history.title')}</h1>
        <p className="text-sm text-stone-500 mt-0.5">{t('history.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-center py-14">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-stone-400">{t('common.loading')}</p>
        </div>
      ) : !data || data.data.length === 0 ? (
        <Card className="text-center py-14">
          <Clock className="h-12 w-12 text-stone-200 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-900 mb-1">{t('history.noGenerationsYet')}</h3>
          <p className="text-xs text-stone-400 mb-5">{t('history.noGenerationsDesc')}</p>
          <Link to="/dashboard/generator">
            <Button size="sm">
              <Wand2 className="h-3.5 w-3.5 mr-1.5" /> {t('common.generateProposal')}
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {data.data.map((gen) => (
              <Link key={gen.id} to={`/dashboard/history/${gen.id}`}>
                <Card hover className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 bg-primary-50 rounded-lg flex items-center justify-center border border-primary-100/60 shrink-0">
                    <Wand2 className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{gen.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-stone-400">{formatDate(gen.created_at, locale)}</span>
                      <span className="text-[11px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium">
                        {gen.credits_used} {gen.credits_used === 1 ? t('common.credit') : t('common.credits')}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-300 shrink-0" />
                </Card>
              </Link>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('common.previous')}
              </Button>
              <span className="text-xs text-stone-500 tabular-nums">
                {t('common.pageOf', { page, total: data.totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
