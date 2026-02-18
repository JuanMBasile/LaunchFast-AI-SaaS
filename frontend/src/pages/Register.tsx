import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Register() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t('auth.register.passwordPlaceholder'));
      return;
    }
    setLoading(true);
    try {
      await register(email, password, fullName);
      toast.success(t('auth.register.subtitle'));
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || t('auth.register.submit'));
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
          <h1 className="text-xl font-bold text-stone-900">{t('auth.register.title')}</h1>
          <p className="mt-1 text-sm text-stone-500">{t('auth.register.subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm shadow-stone-900/4 border border-stone-200/80 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.register.fullName')}
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label={t('auth.register.email')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('auth.register.password')}
              type="password"
              placeholder={t('auth.register.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {t('auth.register.submit')}
            </Button>
          </form>
          <p className="mt-4 text-[10px] text-stone-400 text-center leading-relaxed">
            {t('auth.register.terms')}
          </p>
        </div>

        <p className="text-center mt-5 text-xs text-stone-500">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
