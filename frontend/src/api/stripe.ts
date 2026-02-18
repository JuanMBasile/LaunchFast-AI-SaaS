import { api } from './client';

export const stripeApi = {
  createCheckout: (plan: string) =>
    api.post<{ url: string; sessionId: string }>('/stripe/checkout', { plan }),

  createPortal: () =>
    api.get<{ url: string }>('/stripe/portal'),
};
