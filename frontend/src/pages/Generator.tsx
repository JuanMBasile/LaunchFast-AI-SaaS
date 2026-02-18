import { useState, type FormEvent } from 'react';
import { Wand2, Copy, Download, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { generationsApi } from '../api/generations';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const TONE_KEYS = ['professional', 'friendly', 'formal', 'creative'] as const;
const LANG_KEYS = ['en', 'es', 'fr', 'de', 'pt'] as const;
const TONE_VALUES = [
  'Professional and confident',
  'Friendly and approachable',
  'Formal and corporate',
  'Creative and bold',
];
const LANG_VALUES = ['English', 'Spanish', 'French', 'German', 'Portuguese'];

const selectClasses =
  'w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-150';

const textareaClasses =
  'w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-stone-50/50 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-150 resize-none';

export default function Generator() {
  const { t } = useTranslation();
  const { credits, refreshCredits } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientName: '',
    projectDescription: '',
    scope: '',
    budget: '',
    timeline: '',
    skills: '',
    additionalNotes: '',
    tone: TONE_VALUES[0],
    language: LANG_VALUES[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (credits && credits.remaining < 1) {
      toast.error(t('generator.noCredits'));
      return;
    }
    setLoading(true);
    try {
      const res = await generationsApi.generate({ ...form, budget: Number(form.budget) });
      setResult(res.output);
      await refreshCredits();
      toast.success(t('generator.success'));
    } catch (err: any) {
      toast.error(err.message || t('generator.error'));
    } finally {
      setLoading(false);
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
      a.download = `proposal-${form.clientName.replace(/\s+/g, '-').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('generator.exported'));
    }
  };

  if (result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">{t('common.newProposal')}</span>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5 mr-1.5" /> {t('common.copy')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> {t('common.export')}
            </Button>
          </div>
        </div>
        <Card className="prose prose-stone prose-sm max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-relaxed">
          <ReactMarkdown>{result}</ReactMarkdown>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">{t('generator.title')}</h1>
        <p className="text-sm text-stone-500 mt-0.5">{t('generator.subtitle')}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t('generator.clientName')}
              name="clientName"
              placeholder="Acme Corp"
              value={form.clientName}
              onChange={handleChange}
              required
            />
            <Input
              label={t('generator.budget')}
              name="budget"
              type="number"
              placeholder="5000"
              value={form.budget}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {t('generator.projectDescription')}
            </label>
            <textarea
              name="projectDescription"
              placeholder={t('generator.projectDescriptionPlaceholder')}
              value={form.projectDescription}
              onChange={handleChange}
              required
              rows={4}
              minLength={10}
              className={textareaClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {t('generator.scopeOfWork')}
            </label>
            <textarea
              name="scope"
              placeholder={t('generator.scopePlaceholder')}
              value={form.scope}
              onChange={handleChange}
              required
              rows={3}
              minLength={3}
              className={textareaClasses}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={t('generator.timeline')}
              name="timeline"
              placeholder="4-6 weeks"
              value={form.timeline}
              onChange={handleChange}
              required
            />
            <Input
              label={t('generator.skills')}
              name="skills"
              placeholder={t('generator.skillsPlaceholder')}
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {t('generator.additionalNotes')}
            </label>
            <textarea
              name="additionalNotes"
              placeholder={t('generator.additionalNotesPlaceholder')}
              value={form.additionalNotes}
              onChange={handleChange}
              rows={2}
              className={textareaClasses}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('generator.tone')}
              </label>
              <select name="tone" value={form.tone} onChange={handleChange} className={selectClasses}>
                {TONE_KEYS.map((key, i) => (
                  <option key={key} value={TONE_VALUES[i]}>
                    {t(`generator.toneOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('generator.language')}
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className={selectClasses}
              >
                {LANG_KEYS.map((key, i) => (
                  <option key={key} value={LANG_VALUES[i]}>
                    {t(`generator.languageOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              {t('generator.creditUsage', { count: credits?.remaining ?? 0 })}
            </p>
            <Button type="submit" size="md" loading={loading} disabled={credits?.remaining === 0}>
              <Wand2 className="h-4 w-4 mr-1.5" />
              {t('common.generateProposal')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
