import { Link, useNavigate } from 'react-router';
import { Rocket } from 'lucide-react';
import PageTitle from '../components/shared/PageTitle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.email, data.password, data.fullName);
      toast.success(t('auth.register.subtitle'));
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('auth.register.submit')));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <PageTitle title={t('auth.register.title')} description={t('auth.register.subtitle')} />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary-600/20">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              LaunchFast <span className="text-primary-600">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">{t('auth.register.title')}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('auth.register.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm shadow-stone-900/4 border border-stone-200/80 dark:border-stone-800 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.register.fullName')}
              type="text"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              label={t('auth.register.email')}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('auth.register.password')}
              type="password"
              placeholder={t('auth.register.passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              {t('auth.register.submit')}
            </Button>
          </form>
          <p className="mt-4 text-[10px] text-stone-400 dark:text-stone-500 text-center leading-relaxed">
            {t('auth.register.terms')}
          </p>
        </div>

        <p className="text-center mt-5 text-xs text-stone-500 dark:text-stone-400">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
