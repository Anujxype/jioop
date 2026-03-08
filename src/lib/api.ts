const API_URL = '/api';

export interface AccessKeyData {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  uses: number;
  enabled: boolean;
  expiresAt?: string;
  maxUses?: number;
  scope?: 'read' | 'admin' | 'user';
}

export interface SearchLogData {
  id: string;
  keyName: string;
  endpoint: string;
  query: string;
  timestamp: string;
  status: 'success' | 'error';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  // Auth
  login: (key: string) =>
    request<{ success: boolean; key?: AccessKeyData }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ key }),
    }),

  adminLogin: (password: string) =>
    request<{ success: boolean }>('/auth/admin', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  // Keys
  getKeys: () => request<AccessKeyData[]>('/keys'),

  createKey: (name: string, key?: string, options?: { expiresAt?: string; maxUses?: number; scope?: string }) =>
    request<AccessKeyData>('/keys', {
      method: 'POST',
      body: JSON.stringify({ name, key, ...options }),
    }),

  deleteKey: (id: string) =>
    request<{ success: boolean }>(`/keys/${id}`, { method: 'DELETE' }),

  toggleKey: (id: string) =>
    request<{ success: boolean; enabled: boolean }>(`/keys/${id}/toggle`, {
      method: 'PATCH',
    }),

  incrementKeyUses: (id: string) =>
    request<{ success: boolean }>(`/keys/${id}/increment`, { method: 'PATCH' }),

  // Logs
  getLogs: () => request<SearchLogData[]>('/logs'),

  createLog: (log: { keyName: string; endpoint: string; query: string; status: 'success' | 'error' }) =>
    request<SearchLogData>('/logs', {
      method: 'POST',
      body: JSON.stringify(log),
    }),
};
