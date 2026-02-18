import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.login.title'));
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || t('auth.login.submit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary-600/20">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              LaunchFast <span className="text-primary-600">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-stone-900">{t('auth.login.title')}</h1>
          <p className="mt-1 text-sm text-stone-500">{t('auth.login.subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm shadow-stone-900/4 border border-stone-200/80 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.login.email')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('auth.login.password')}
              type="password"
              placeholder={t('auth.login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {t('auth.login.submit')}
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 text-xs text-stone-500">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
            {t('auth.login.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
