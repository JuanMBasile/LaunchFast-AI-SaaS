import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Copy, Download, Calendar, Zap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generationsApi } from '../api/generations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Generation } from '../types';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function GenerationDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = i18n.resolvedLanguage || 'en';

  useEffect(() => {
    if (id) {
      generationsApi
        .getOne(id)
        .then(setGeneration)
        .catch(() => toast.error(t('common.generationNotFound')))
        .finally(() => setLoading(false));
    }
  }, [id, t]);

  const handleCopy = () => {
    if (generation) {
      navigator.clipboard.writeText(generation.output);
      toast.success(t('generationDetail.copied'));
    }
  };

  const handleExport = () => {
    if (generation) {
      const blob = new Blob([generation.output], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal-${generation.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('generationDetail.exported'));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-14">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!generation) {
    return (
      <Card className="text-center py-14">
        <p className="text-sm text-stone-400">{t('common.generationNotFound')}</p>
        <Link
          to="/dashboard/history"
          className="text-sm text-primary-600 font-medium mt-2 inline-block hover:text-primary-700"
        >
          {t('common.backToHistory')}
        </Link>
      </Card>
    );
  }

  const creditsLabel =
    generation.credits_used === 1
      ? t('generationDetail.creditsUsed')
      : t('generationDetail.creditsUsed_other');

  return (
    <div className="space-y-0">
      <Card className="overflow-hidden p-0 border-stone-200/80 dark:border-stone-800">
        <div className="bg-linear-to-br from-primary-600 to-primary-800 text-white px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl dark:text-white">
                {generation.title}
              </h1>
              <p className="mt-0.5 text-sm text-primary-100">
                {formatDate(generation.created_at, locale)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-6 py-3 dark:border-stone-800 dark:bg-stone-900/50 sm:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/80 px-2.5 py-1 text-xs font-medium text-stone-700 dark:bg-stone-700 dark:text-stone-300">
            <Calendar className="h-3 w-3" />
            {formatDate(generation.created_at, locale)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            <Zap className="h-3 w-3" />
            {generation.credits_used} {creditsLabel}
          </span>
        </div>
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-3 dark:border-stone-800 dark:bg-stone-900 sm:px-8">
          <Link
            to="/dashboard/history"
            className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.backToHistory')}
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5 mr-1.5" /> {t('common.copy')}
            </Button>
            <Button variant="primary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> {t('common.export')}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            'prose prose-stone prose-sm max-w-none px-6 py-8 dark:prose-invert sm:px-8',
            'prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-relaxed',
            'prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-2 prose-h2:mb-4 dark:prose-h2:border-stone-700',
            'prose-pre:bg-stone-100 prose-pre:border prose-pre:border-stone-200 dark:prose-pre:bg-stone-800/80 dark:prose-pre:border-stone-700',
          )}
        >
          <ReactMarkdown>{generation.output}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
