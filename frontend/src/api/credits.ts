import { api } from './client';
import type { Credits } from '../types';

export const creditsApi = {
  getCredits: () => api.get<Credits>('/credits'),
};
