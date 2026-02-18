import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../ui/Button';

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
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
          <div className="text-center max-w-sm">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 border border-amber-200/80 mb-6">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-stone-500 mb-6">
              An unexpected error occurred. Please try again or go back to the home page.
            </p>
            <Link to="/">
              <Button size="lg">
                <Home className="h-4 w-4 mr-2" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
