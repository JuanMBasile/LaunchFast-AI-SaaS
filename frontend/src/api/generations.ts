import { api } from './client';
import type { Generation, PaginatedResponse, ProposalInput } from '../types';

export const generationsApi = {
  generate: (data: ProposalInput) =>
    api.post<{ id: string; output: string; creditsUsed: number }>('/ai/generate-proposal', data),

  getAll: (page: number = 1, limit: number = 20) =>
    api.get<PaginatedResponse<Generation>>(`/generations?page=${page}&limit=${limit}`),

  getOne: (id: string) => api.get<Generation>(`/generations/${id}`),
};
