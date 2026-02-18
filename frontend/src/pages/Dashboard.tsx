import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Wand2, Clock, TrendingUp, Zap, ArrowRight, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { generationsApi } from '../api/generations';
import { stripeApi } from '../api/stripe';
import Card from '../components/ui/Card';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';
import PageTitle from '../components/shared/PageTitle';
import type { Generation } from '../types';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

const statIcons = [
  { icon: Zap, bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100/60' },
  { icon: TrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/60' },
  { icon: Clock, bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100/60' },
  { icon: CreditCard, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/60' },
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, credits } = useAuth();
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generationsApi
      .getAll(1, 5)
      .then((res) => setRecentGenerations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleManageBilling = async () => {
    try {
      const { url } = await stripeApi.createPortal();
      window.location.href = url;
    } catch {
      toast.error(t('dashboard.billingError'));
    }
  };

  const locale = i18n.resolvedLanguage || 'en';

  const stats = [
    { label: t('dashboard.creditsLeft'), value: credits?.remaining ?? 0 },
    { label: t('dashboard.creditsUsed'), value: credits?.used ?? 0 },
    { label: t('dashboard.proposals'), value: recentGenerations.length },
    { label: t('dashboard.plan'), value: user?.plan, capitalize: true },
  ];

  return (
    <div className="space-y-7">
      <PageTitle title={t('nav.dashboard')} description={t('dashboard.overview')} />
      <div>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
          {t('dashboard.welcome', { name: user?.fullName?.split(' ')[0] })}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{t('dashboard.overview')}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="stat" />)
        ) : (
          stats.map((stat, i) => {
            const s = statIcons[i]!;
            return (
              <Card key={i}>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 ${s.bg} rounded-lg flex items-center justify-center border ${s.border}`}
                  >
                    <s.icon className={`h-4.5 w-4.5 ${s.text}`} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">{stat.label}</p>
                    <p className={`text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums ${stat.capitalize ? 'capitalize' : ''}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card hover>
          <Link to="/dashboard/generator" className="flex items-center gap-3">
            <div className="h-11 w-11 bg-primary-50 rounded-lg flex items-center justify-center border border-primary-100/60">
              <Wand2 className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t('dashboard.generateProposal')}</h3>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('dashboard.generateProposalDesc')}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-stone-300 dark:text-stone-600" />
          </Link>
        </Card>

        {user?.plan === 'free' && (
          <Card hover className="border-accent-200/60 bg-accent-50/30">
            <Link to="/pricing" className="flex items-center gap-3">
              <div className="h-11 w-11 bg-accent-100 rounded-lg flex items-center justify-center border border-accent-200/60">
                <Zap className="h-5 w-5 text-accent-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t('dashboard.upgradeToPro')}</h3>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('dashboard.upgradeDesc')}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-accent-400" />
            </Link>
          </Card>
        )}

        {user?.plan === 'pro' && (
          <Card hover onClick={handleManageBilling}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100/60">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t('dashboard.manageBilling')}</h3>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('dashboard.manageBillingDesc')}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-300 dark:text-stone-600" />
            </div>
          </Card>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t('dashboard.recentProposals')}</h2>
          <Link
            to="/dashboard/history"
            className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            {t('common.viewAll')}
          </Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} variant="list" />
            ))}
          </div>
        ) : recentGenerations.length === 0 ? (
          <Card className="text-center py-10">
            <Wand2 className="h-10 w-10 text-stone-200 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">{t('dashboard.noProposalsYet')}</h3>
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">{t('dashboard.noProposalsDesc')}</p>
            <Link to="/dashboard/generator">
              <Button size="sm">{t('common.generateProposal')}</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentGenerations.map((gen) => (
              <Link key={gen.id} to={`/dashboard/history/${gen.id}`}>
                <Card hover className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{gen.title}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{formatDate(gen.created_at, locale)}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
