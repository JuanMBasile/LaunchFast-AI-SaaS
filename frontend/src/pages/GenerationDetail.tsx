import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Copy, Download, Calendar, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generationsApi } from '../api/generations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Generation } from '../types';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

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
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/dashboard/history"
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">{t('common.backToHistory')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5 mr-1.5" /> {t('common.copy')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> {t('common.export')}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="text-lg font-bold text-stone-900 tracking-tight mb-3">{generation.title}</h1>
        <div className="flex items-center gap-4 mb-5 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(generation.created_at, locale)}
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" />
            {generation.credits_used} {creditsLabel}
          </div>
        </div>
        <div className="border-t border-stone-100 pt-5 prose prose-stone prose-sm max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-relaxed">
          <ReactMarkdown>{generation.output}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
