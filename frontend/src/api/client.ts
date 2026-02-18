import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

function handleUnauthorized(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
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

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
    let response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (response.status === 401 && (await this.tryRefresh())) {
      response = await fetch(`${this.baseUrl}/api/v1${path}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
    }
    return this.checkResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    let response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401 && (await this.tryRefresh())) {
      response = await fetch(`${this.baseUrl}/api/v1${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
    }
    return this.checkResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);
