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

const loginSchema = z.object({
  email: z.string().min(1, 'Email required').email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success(t('auth.login.title'));
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('auth.login.submit')));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <PageTitle title={t('auth.login.title')} description={t('auth.login.subtitle')} />
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
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">{t('auth.login.title')}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('auth.login.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm shadow-stone-900/4 border border-stone-200/80 dark:border-stone-800 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.login.email')}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('auth.login.password')}
              type="password"
              placeholder={t('auth.login.passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              {t('auth.login.submit')}
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 text-xs text-stone-500 dark:text-stone-400">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
            {t('auth.login.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
