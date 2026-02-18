import { api } from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getProfile: () => api.get<User>('/auth/me'),
};
