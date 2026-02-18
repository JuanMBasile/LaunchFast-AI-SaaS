import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../ui/Button';
import i18n from '../../i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const title = i18n.t('errorBoundary.title');
      const message = i18n.t('errorBoundary.message');
      const backHome = i18n.t('errorBoundary.backHome');
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
          <div className="text-center max-w-sm">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-800/60 mb-6">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" aria-hidden />
            </div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-2">{title}</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">{message}</p>
            <Link to="/">
              <Button size="lg">
                <Home className="h-4 w-4 mr-2" aria-hidden />
                {backHome}
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
