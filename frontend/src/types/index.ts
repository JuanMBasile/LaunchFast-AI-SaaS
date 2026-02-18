export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  plan: 'free' | 'pro';
  tenantId: string;
  createdAt: string;
}

export interface Credits {
  total: number;
  used: number;
  remaining: number;
  resetAt: string | null;
}

export interface Generation {
  id: string;
  user_id: string;
  type: string;
  title: string;
  input: ProposalInput;
  output: string;
  credits_used: number;
  created_at: string;
}

export interface ProposalInput {
  clientName: string;
  projectDescription: string;
  scope: string;
  budget: number;
  timeline: string;
  skills: string;
  additionalNotes?: string;
  tone?: string;
  language?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

/** Type-safe error message extraction for catch blocks. */
export function getErrorMessage(err: unknown, fallback = 'Unexpected error'): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}
