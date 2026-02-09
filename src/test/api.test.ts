import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/lib/api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('api client', () => {
  it('login sends key and returns result', async () => {
    const payload = { success: true, key: { id: '1', name: 'Test', key: 'abc', createdAt: '01/01/2025', uses: 0, enabled: true } };
    mockFetch.mockReturnValueOnce(jsonResponse(payload));

    const result = await api.login('abc');
    expect(result).toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ key: 'abc' }),
    }));
  });

  it('adminLogin sends password and returns result', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ success: true }));
    const result = await api.adminLogin('pass');
    expect(result.success).toBe(true);
  });

  it('getKeys fetches keys', async () => {
    const keys = [{ id: '1', name: 'K1', key: 'k1', createdAt: '', uses: 0, enabled: true }];
    mockFetch.mockReturnValueOnce(jsonResponse(keys));
    const result = await api.getKeys();
    expect(result).toEqual(keys);
    expect(mockFetch).toHaveBeenCalledWith('/api/keys', expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }));
  });

  it('createKey posts a new key', async () => {
    const newKey = { id: '2', name: 'New', key: 'fx_abc', createdAt: '', uses: 0, enabled: true };
    mockFetch.mockReturnValueOnce(jsonResponse(newKey));
    const result = await api.createKey('New', 'fx_abc');
    expect(result).toEqual(newKey);
    expect(mockFetch).toHaveBeenCalledWith('/api/keys', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'New', key: 'fx_abc' }),
    }));
  });

  it('deleteKey sends DELETE request', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ success: true }));
    const result = await api.deleteKey('1');
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('/api/keys/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('toggleKey sends PATCH request', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ success: true, enabled: false }));
    const result = await api.toggleKey('1');
    expect(result.success).toBe(true);
  });

  it('incrementKeyUses sends PATCH request', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ success: true }));
    const result = await api.incrementKeyUses('1');
    expect(result.success).toBe(true);
  });

  it('getLogs fetches logs', async () => {
    const logs = [{ id: '1', keyName: 'K1', endpoint: '/mobile', query: '123', status: 'success', timestamp: '' }];
    mockFetch.mockReturnValueOnce(jsonResponse(logs));
    const result = await api.getLogs();
    expect(result).toEqual(logs);
  });

  it('createLog posts a new log', async () => {
    const log = { keyName: 'K1', endpoint: '/mobile', query: '123', status: 'success' as const };
    const saved = { ...log, id: '1', timestamp: '2025-01-01T00:00:00.000Z' };
    mockFetch.mockReturnValueOnce(jsonResponse(saved));
    const result = await api.createLog(log);
    expect(result).toEqual(saved);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ error: 'fail' }, 500));
    await expect(api.getKeys()).rejects.toThrow('API error: 500');
  });
});
