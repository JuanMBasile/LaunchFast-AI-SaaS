import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Copy, Download, ArrowLeft, Sparkles, Calendar, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { generationsApi } from '../api/generations';
import { getErrorMessage } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import PageTitle from '../components/shared/PageTitle';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const TONE_KEYS = ['professional', 'friendly', 'formal', 'creative'] as const;
const LANG_KEYS = ['en', 'es', 'fr', 'de', 'pt'] as const;
const TONE_VALUES = [
  'Professional and confident',
  'Friendly and approachable',
  'Formal and corporate',
  'Creative and bold',
];
const LANG_VALUES = ['English', 'Spanish', 'French', 'German', 'Portuguese'];

const generatorSchema = z.object({
  clientName: z.string().min(1, 'Client name required'),
  budget: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Budget must be 0 or greater'),
  projectDescription: z.string().min(10, 'At least 10 characters'),
  scope: z.string().min(3, 'At least 3 characters'),
  timeline: z.string().min(1, 'Timeline required'),
  skills: z.string().min(1, 'Skills required'),
  additionalNotes: z.string().optional(),
  tone: z.string(),
  language: z.string(),
});

type GeneratorForm = z.infer<typeof generatorSchema>;

const selectClasses =
  'w-full px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-150';
const textareaClasses =
  'w-full px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-150 resize-none';

export default function Generator() {
  const { t } = useTranslation();
  const { credits, refreshCredits } = useAuth();
  const [result, setResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GeneratorForm>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      clientName: '',
      projectDescription: '',
      scope: '',
      budget: '',
      timeline: '',
      skills: '',
      additionalNotes: '',
      tone: TONE_VALUES[0],
      language: LANG_VALUES[0],
    },
  });

  const clientName = watch('clientName');

  const onSubmit = async (data: GeneratorForm) => {
    if (credits && credits.remaining < 1) {
      toast.error(t('generator.noCredits'));
      return;
    }
    try {
      const res = await generationsApi.generate({
        ...data,
        budget: Number(data.budget),
      });
      setResult(res.output);
      await refreshCredits();
      toast.success(t('generator.success'));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('generator.error')));
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success(t('generator.copied'));
    }
  };

  const handleExport = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal-${(clientName || 'proposal').replace(/\s+/g, '-').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('generator.exported'));
    }
  };

  if (result) {
    const displayName = clientName?.trim() || t('generator.title');
    return (
      <div className="space-y-0">
        <Card className="overflow-hidden p-0 border-stone-200/80 dark:border-stone-800">
          <div className="bg-linear-to-br from-primary-600 to-primary-800 text-white px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                  {t('generator.proposalReady')}
                </h1>
                <p className="mt-0.5 text-sm text-primary-100">
                  {t('generator.proposalFor', { name: displayName })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-6 py-3 dark:border-stone-800 dark:bg-stone-900/50 sm:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/80 px-2.5 py-1 text-xs font-medium text-stone-700 dark:bg-stone-700 dark:text-stone-300">
              <Calendar className="h-3 w-3" />
              {t('generator.generatedJustNow')}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
              {displayName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              <Zap className="h-3 w-3" />
              {t('generator.creditUsed')}
            </span>
          </div>
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-3 dark:border-stone-800 dark:bg-stone-900 sm:px-8">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.newProposal')}
            </button>
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
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageTitle title={t('generator.title')} description={t('generator.subtitle')} />
      <div>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">{t('generator.title')}</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{t('generator.subtitle')}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t('generator.clientName')}
              placeholder="Acme Corp"
              error={errors.clientName?.message}
              {...register('clientName')}
            />
            <Input
              label={t('generator.budget')}
              type="number"
              placeholder="5000"
              error={errors.budget?.message}
              {...register('budget')}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('generator.projectDescription')}
            </label>
            <textarea
              placeholder={t('generator.projectDescriptionPlaceholder')}
              rows={4}
              className={cn(textareaClasses, errors.projectDescription && 'border-red-500')}
              {...register('projectDescription')}
            />
            {errors.projectDescription && (
              <p className="mt-1 text-xs text-red-600">{errors.projectDescription.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('generator.scopeOfWork')}
            </label>
            <textarea
              placeholder={t('generator.scopePlaceholder')}
              rows={3}
              className={cn(textareaClasses, errors.scope && 'border-red-500')}
              {...register('scope')}
            />
            {errors.scope && <p className="mt-1 text-xs text-red-600">{errors.scope.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t('generator.timeline')}
              placeholder="4-6 weeks"
              error={errors.timeline?.message}
              {...register('timeline')}
            />
            <Input
              label={t('generator.skills')}
              placeholder={t('generator.skillsPlaceholder')}
              error={errors.skills?.message}
              {...register('skills')}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('generator.additionalNotes')}
            </label>
            <textarea
              placeholder={t('generator.additionalNotesPlaceholder')}
              rows={2}
              className={textareaClasses}
              {...register('additionalNotes')}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                {t('generator.tone')}
              </label>
              <select className={selectClasses} aria-label={t('generator.tone')} {...register('tone')}>
                {TONE_KEYS.map((key, i) => (
                  <option key={key} value={TONE_VALUES[i]}>
                    {t(`generator.toneOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                {t('generator.language')}
              </label>
              <select className={selectClasses} aria-label={t('generator.language')} {...register('language')}>
                {LANG_KEYS.map((key, i) => (
                  <option key={key} value={LANG_VALUES[i]}>
                    {t(`generator.languageOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              {t('generator.creditUsage', { count: credits?.remaining ?? 0 })}
            </p>
            <Button type="submit" size="md" loading={isSubmitting} disabled={credits?.remaining === 0}>
              <Wand2 className="h-4 w-4 mr-1.5" />
              {t('common.generateProposal')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
