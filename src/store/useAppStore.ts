import { create } from 'zustand';
import { api } from '@/lib/api';

export interface AccessKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  uses: number;
  enabled: boolean;
}

export interface SearchLog {
  id: string;
  keyName: string;
  endpoint: string;
  query: string;
  timestamp: string;
  status: 'success' | 'error';
}

interface AppState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentKey: AccessKey | null;
  accessKeys: AccessKey[];
  searchLogs: SearchLog[];
  login: (key: string) => Promise<boolean>;
  adminLogin: (password: string) => Promise<boolean>;
  logout: () => void;
  addKey: (name: string, value?: string) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  toggleKey: (id: string) => Promise<void>;
  addLog: (log: Omit<SearchLog, 'id' | 'timestamp'>) => Promise<void>;
  incrementKeyUses: (keyId: string) => Promise<void>;
  loadKeys: () => Promise<void>;
  loadLogs: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  isAdmin: false,
  currentKey: null,
  accessKeys: [],
  searchLogs: [],

  login: async (key: string) => {
    try {
      const result = await api.login(key);
      if (result.success && result.key) {
        set({ isLoggedIn: true, currentKey: result.key as AccessKey });
        return true;
      }
    } catch {
      // API unavailable – fall back to local check
      const found = get().accessKeys.find(k => k.key === key && k.enabled);
      if (found) {
        set({ isLoggedIn: true, currentKey: found });
        return true;
      }
    }
    return false;
  },

  adminLogin: async (password: string) => {
    try {
      const result = await api.adminLogin(password);
      if (result.success) {
        set({ isAdmin: true });
        return true;
      }
    } catch {
      // API unavailable – fall back to local check
      if (password === 'stk7890') {
        set({ isAdmin: true });
        return true;
      }
    }
    return false;
  },

  logout: () => set({ isLoggedIn: false, isAdmin: false, currentKey: null }),

  addKey: async (name: string, value?: string) => {
    try {
      const newKey = await api.createKey(name, value || undefined);
      set({ accessKeys: [...get().accessKeys, newKey as AccessKey] });
    } catch {
      // API unavailable
    }
  },

  deleteKey: async (id: string) => {
    try {
      await api.deleteKey(id);
      set({ accessKeys: get().accessKeys.filter(k => k.id !== id) });
    } catch {
      // API unavailable
    }
  },

  toggleKey: async (id: string) => {
    try {
      await api.toggleKey(id);
      const keys = get().accessKeys.map(k =>
        k.id === id ? { ...k, enabled: !k.enabled } : k
      );
      set({ accessKeys: keys });
    } catch {
      // API unavailable
    }
  },

  addLog: async (log) => {
    try {
      const newLog = await api.createLog(log);
      set({ searchLogs: [newLog as SearchLog, ...get().searchLogs].slice(0, 500) });
    } catch {
      // API unavailable
    }
  },

  incrementKeyUses: async (keyId: string) => {
    try {
      await api.incrementKeyUses(keyId);
      const keys = get().accessKeys.map(k =>
        k.id === keyId ? { ...k, uses: k.uses + 1 } : k
      );
      set({ accessKeys: keys });
    } catch {
      // API unavailable
    }
  },

  loadKeys: async () => {
    try {
      const keys = await api.getKeys();
      set({ accessKeys: keys as AccessKey[] });
    } catch {
      // API unavailable
    }
  },

  loadLogs: async () => {
    try {
      const logs = await api.getLogs();
      set({ searchLogs: logs as SearchLog[] });
    } catch {
      // API unavailable
    }
  },
}));
