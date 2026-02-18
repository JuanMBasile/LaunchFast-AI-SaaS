import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { stripeApi } from '../api/stripe';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PricingCard from '../components/shared/PricingCard';
import { PLANS } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Pricing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/register');
      return;
    }
    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }
    setLoading(true);
    try {
      const { url } = await stripeApi.createCheckout(planId);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err.message || t('pricing.checkoutError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
              {t('pricing.title')}
            </h1>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto items-start">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currentPlan={user?.plan}
                onSelect={handleSelectPlan}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
