import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

function handleUnauthorized(): void {
  localStorage.removeItem('accessToken');
  window.dispatchEvent(new Event('auth:logout'));
  toast.error('Session expired. Please log in again.');
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async checkResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      handleUnauthorized();
      const error = await response.json().catch(() => ({ message: 'Unauthorized' }));
      throw new Error(error.message || 'Unauthorized');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.checkResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.checkResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);
