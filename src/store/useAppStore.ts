import { create } from 'zustand';

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
  login: (key: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
  addKey: (name: string, value?: string) => void;
  deleteKey: (id: string) => void;
  toggleKey: (id: string) => void;
  addLog: (log: Omit<SearchLog, 'id' | 'timestamp'>) => void;
  incrementKeyUses: (keyId: string) => void;
}

const generateKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'fx_';
  for (let i = 0; i < 24; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const ADMIN_PASSWORD = 'stk7890';
const DEFAULT_KEY: AccessKey = {
  id: '1',
  name: 'Default',
  key: 'test7890',
  createdAt: new Date().toLocaleDateString('en-GB'),
  uses: 0,
  enabled: true,
};

const loadState = () => {
  try {
    const keys = localStorage.getItem('fastx_keys');
    const logs = localStorage.getItem('fastx_logs');
    return {
      accessKeys: keys ? JSON.parse(keys) : [DEFAULT_KEY],
      searchLogs: logs ? JSON.parse(logs) : [],
    };
  } catch {
    return { accessKeys: [DEFAULT_KEY], searchLogs: [] };
  }
};

const saveKeys = (keys: AccessKey[]) => localStorage.setItem('fastx_keys', JSON.stringify(keys));
const saveLogs = (logs: SearchLog[]) => localStorage.setItem('fastx_logs', JSON.stringify(logs));

const initial = loadState();

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  isAdmin: false,
  currentKey: null,
  accessKeys: initial.accessKeys,
  searchLogs: initial.searchLogs,

  login: (key: string) => {
    const found = get().accessKeys.find(k => k.key === key && k.enabled);
    if (found) {
      set({ isLoggedIn: true, currentKey: found });
      return true;
    }
    return false;
  },

  adminLogin: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isLoggedIn: false, isAdmin: false, currentKey: null }),

  addKey: (name: string, value?: string) => {
    const newKey: AccessKey = {
      id: Date.now().toString(),
      name,
      key: value || generateKey(),
      createdAt: new Date().toLocaleDateString('en-GB'),
      uses: 0,
      enabled: true,
    };
    const keys = [...get().accessKeys, newKey];
    saveKeys(keys);
    set({ accessKeys: keys });
  },

  deleteKey: (id: string) => {
    const keys = get().accessKeys.filter(k => k.id !== id);
    saveKeys(keys);
    set({ accessKeys: keys });
  },

  toggleKey: (id: string) => {
    const keys = get().accessKeys.map(k => k.id === id ? { ...k, enabled: !k.enabled } : k);
    saveKeys(keys);
    set({ accessKeys: keys });
  },

  addLog: (log) => {
    const newLog: SearchLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const logs = [newLog, ...get().searchLogs].slice(0, 500);
    saveLogs(logs);
    set({ searchLogs: logs });
  },

  incrementKeyUses: (keyId: string) => {
    const keys = get().accessKeys.map(k => k.id === keyId ? { ...k, uses: k.uses + 1 } : k);
    saveKeys(keys);
    set({ accessKeys: keys });
  },
}));
