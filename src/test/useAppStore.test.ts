import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    login: vi.fn(),
    adminLogin: vi.fn(),
    getKeys: vi.fn(),
    createKey: vi.fn(),
    deleteKey: vi.fn(),
    toggleKey: vi.fn(),
    incrementKeyUses: vi.fn(),
    getLogs: vi.fn(),
    createLog: vi.fn(),
  },
}));

describe('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useAppStore.setState({
      isLoggedIn: false,
      isAdmin: false,
      currentKey: null,
      accessKeys: [],
      searchLogs: [],
    });
  });

  describe('adminLogin', () => {
    it('should login via API when available', async () => {
      vi.mocked(api.adminLogin).mockResolvedValueOnce({ success: true });

      const result = await useAppStore.getState().adminLogin('testpass');

      expect(result).toBe(true);
      expect(useAppStore.getState().isAdmin).toBe(true);
      expect(api.adminLogin).toHaveBeenCalledWith('testpass');
    });

    it('should fail when API returns failure', async () => {
      vi.mocked(api.adminLogin).mockResolvedValueOnce({ success: false });

      const result = await useAppStore.getState().adminLogin('wrongpass');

      expect(result).toBe(false);
      expect(useAppStore.getState().isAdmin).toBe(false);
    });

    it('should fallback to local check with default password when API is unavailable', async () => {
      vi.mocked(api.adminLogin).mockRejectedValueOnce(new Error('API unavailable'));

      const result = await useAppStore.getState().adminLogin('stk7890');

      expect(result).toBe(true);
      expect(useAppStore.getState().isAdmin).toBe(true);
    });

    it('should fail when API is unavailable and password is incorrect', async () => {
      vi.mocked(api.adminLogin).mockRejectedValueOnce(new Error('API unavailable'));

      const result = await useAppStore.getState().adminLogin('wrongpass');

      expect(result).toBe(false);
      expect(useAppStore.getState().isAdmin).toBe(false);
    });

    it('should fail when API is unavailable and password is empty', async () => {
      vi.mocked(api.adminLogin).mockRejectedValueOnce(new Error('API unavailable'));

      const result = await useAppStore.getState().adminLogin('');

      expect(result).toBe(false);
      expect(useAppStore.getState().isAdmin).toBe(false);
    });
  });

  describe('login', () => {
    it('should login via API when available', async () => {
      const mockKey = {
        id: '1',
        name: 'Test Key',
        key: 'fx_test123',
        createdAt: '2025-01-01',
        uses: 0,
        enabled: true,
      };
      vi.mocked(api.login).mockResolvedValueOnce({ success: true, key: mockKey });

      const result = await useAppStore.getState().login('fx_test123');

      expect(result).toBe(true);
      expect(useAppStore.getState().isLoggedIn).toBe(true);
      expect(useAppStore.getState().currentKey).toEqual(mockKey);
    });

    it('should fallback to local check when API is unavailable', async () => {
      const mockKey = {
        id: '1',
        name: 'Test Key',
        key: 'fx_test123',
        createdAt: '2025-01-01',
        uses: 0,
        enabled: true,
      };
      useAppStore.setState({ accessKeys: [mockKey] });
      vi.mocked(api.login).mockRejectedValueOnce(new Error('API unavailable'));

      const result = await useAppStore.getState().login('fx_test123');

      expect(result).toBe(true);
      expect(useAppStore.getState().isLoggedIn).toBe(true);
      expect(useAppStore.getState().currentKey).toEqual(mockKey);
    });

    it('should fail when API is unavailable and key not found locally', async () => {
      vi.mocked(api.login).mockRejectedValueOnce(new Error('API unavailable'));

      const result = await useAppStore.getState().login('nonexistent');

      expect(result).toBe(false);
      expect(useAppStore.getState().isLoggedIn).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear login state', () => {
      useAppStore.setState({
        isLoggedIn: true,
        isAdmin: true,
        currentKey: {
          id: '1',
          name: 'Test',
          key: 'fx_test',
          createdAt: '2025-01-01',
          uses: 0,
          enabled: true,
        },
      });

      useAppStore.getState().logout();

      expect(useAppStore.getState().isLoggedIn).toBe(false);
      expect(useAppStore.getState().isAdmin).toBe(false);
      expect(useAppStore.getState().currentKey).toBe(null);
    });
  });
});
