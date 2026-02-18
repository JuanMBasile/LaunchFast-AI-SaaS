import { Link } from 'react-router';
import { Rocket, Zap, Shield, Clock, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTitle from '../components/shared/PageTitle';

const featureIcons = [Sparkles, Zap, Shield, Clock] as const;

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950">
      <PageTitle title={t('landing.hero.badge')} description={t('landing.hero.subtitle')} />
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(35,87,153,0.08),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6 border border-primary-100 dark:border-primary-800">
              <Rocket className="h-3 w-3" />
              {t('landing.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.1] mb-5">
              {t('landing.hero.title')}{' '}
              <span className="text-primary-600">{t('landing.hero.titleHighlight')}</span>{' '}
              {t('landing.hero.titleEnd')}
            </h1>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-8 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="px-6">
                  {t('landing.hero.startFree')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="px-6">
                  {t('landing.hero.viewPricing')}
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-5 mt-7 text-xs text-stone-400 dark:text-stone-500">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-accent-400 fill-accent-400" />
                <span>{t('landing.hero.freeCredits')}</span>
              </div>
              <span className="h-3 w-px bg-stone-200 dark:bg-stone-700" />
              <span>{t('landing.hero.noCard')}</span>
              <span className="h-3 w-px bg-stone-200 dark:bg-stone-700" />
              <span>{t('landing.hero.cancelAnytime')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50/80 dark:bg-stone-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-3">
              {t('landing.features.heading')}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              {t('landing.features.subheading')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[0, 1, 2, 3].map((i) => {
              const Icon = featureIcons[i]!;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-stone-900/2 hover:shadow-md hover:shadow-stone-900/5 dark:shadow-stone-950 transition-all duration-200"
                >
                  <div className="inline-flex items-center justify-center h-10 w-10 bg-primary-50 rounded-lg mb-4 border border-primary-100/60">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                    {t(`landing.features.${i}.title`)}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {t(`landing.features.${i}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-sm text-primary-200/70 mb-8 max-w-md mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          <Link to="/register">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white! text-primary-900! hover:bg-stone-100! shadow-lg shadow-black/10 px-6 border-0"
            >
              {t('landing.cta.button')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
