import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string, locale?: string) {
  const loc = locale || 'en';
  return new Intl.DateTimeFormat(loc === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export const PLANS: import('../types').Plan[] = [
  { id: 'free', name: 'Free', price: 0, credits: 5, features: [], popular: false },
  { id: 'pro', name: 'Pro', price: 19, credits: 100, features: [], popular: true },
];
