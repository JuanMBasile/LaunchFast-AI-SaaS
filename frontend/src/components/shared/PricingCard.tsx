import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import type { Plan } from '../../types';
import { cn } from '../../lib/utils';

interface PricingCardProps {
  plan: Plan;
  currentPlan?: string;
  onSelect: (planId: string) => void;
  loading?: boolean;
}

export default function PricingCard({ plan, currentPlan, onSelect, loading }: PricingCardProps) {
  const { t } = useTranslation();
  const isCurrentPlan = currentPlan === plan.id;
  const name = t(`plans.${plan.id}.name`);
  const features = t(`plans.${plan.id}.features`, { returnObjects: true }) as string[];
  const creditsLabel = t(`plans.${plan.id}.creditsPerMonth`);
  const cta = isCurrentPlan
    ? t('plans.pro.currentPlan')
    : plan.price === 0
      ? t('plans.free.cta')
      : t('plans.pro.cta');

  return (
    <div
      className={cn(
        'relative rounded-xl border p-7 transition-all duration-200',
        plan.popular
          ? 'border-primary-600 bg-white shadow-lg shadow-primary-600/10 ring-1 ring-primary-600'
          : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm shadow-stone-900/3',
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-primary-600/20">
            {t('plans.pro.mostPopular')}
          </span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
          {name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight text-stone-900">${plan.price}</span>
          {plan.price > 0 && <span className="text-sm text-stone-400 font-medium">/mes</span>}
        </div>
        <p className="mt-1.5 text-xs text-stone-500">
          {plan.credits} {creditsLabel}
        </p>
      </div>
      <ul className="space-y-2.5 mb-7">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Check className="h-2.5 w-2.5 text-primary-700" />
            </div>
            <span className="text-sm text-stone-600 leading-snug">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={plan.popular ? 'primary' : 'outline'}
        size="lg"
        className="w-full"
        onClick={() => onSelect(plan.id)}
        disabled={isCurrentPlan}
        loading={loading}
      >
        {cta}
      </Button>
    </div>
  );
}
