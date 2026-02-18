import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import History from './pages/History';
import Pricing from './pages/Pricing';
import GenerationDetail from './pages/GenerationDetail';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/shared/ErrorBoundary';
import SkipToContent from './components/shared/SkipToContent';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <ErrorBoundary>
        <SkipToContent />
        <div id="main-content">
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="generator" element={<Generator />} />
          <Route path="history" element={<History />} />
          <Route path="history/:id" element={<GenerationDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </ErrorBoundary>
    </>
  );
}
