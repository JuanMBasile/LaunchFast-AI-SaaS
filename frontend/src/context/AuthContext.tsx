import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { creditsApi } from '../api/credits';
import type { User, Credits } from '../types';

interface AuthContextType {
  user: User | null;
  credits: Credits | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshCredits: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  const refreshCredits = useCallback(async () => {
    try {
      const c = await creditsApi.getCredits();
      setCredits(c);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      Promise.all([refreshUser(), refreshCredits()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser, refreshCredits]);

  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setCredits(null);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('accessToken', res.accessToken);
    if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
    await refreshCredits();
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await authApi.register({ email, password, fullName });
    localStorage.setItem('accessToken', res.accessToken);
    if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
    await refreshCredits();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setCredits(null);
  };

  return (
    <AuthContext.Provider value={{ user, credits, loading, login, register, logout, refreshCredits, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
