import { useState } from 'react';
import { Shield, Plus, Trash2, Copy, RefreshCw, LogOut, Key, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPage = () => {
  const { isAdmin, accessKeys, searchLogs, logout, addKey, deleteKey, toggleKey } = useAppStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'keys' | 'logs'>('keys');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error('Key name is required');
      return;
    }
    addKey(newName.trim(), newValue.trim() || undefined);
    setNewName('');
    setNewValue('');
    toast.success('Key created');
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('keys')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              tab === 'keys' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Key className="w-4 h-4" /> Access Keys
          </button>
          <button
            onClick={() => setTab('logs')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              tab === 'logs' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <FileText className="w-4 h-4" /> Search Logs
          </button>
        </div>

        {tab === 'keys' && (
          <>
            {/* Create Key */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" /> Create New Key
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Key Name</label>
                  <input
                    placeholder="e.g., User Alpha"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Key Value (auto-generated if empty)</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Auto-generated"
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        let r = 'fx_';
                        for (let i = 0; i < 24; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
                        setNewValue(r);
                      }}
                      className="px-3 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity text-sm"
              >
                <Plus className="w-4 h-4" /> Create Key
              </button>
            </div>

            {/* Keys List */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> Active Keys ({accessKeys.length})
                </h2>
              </div>
              <div className="space-y-3">
                {accessKeys.map(k => (
                  <div key={k.id} className={`p-4 rounded-lg border transition-colors ${k.enabled ? 'bg-secondary/50 border-border' : 'bg-muted/30 border-border/30 opacity-60'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{k.name}</p>
                        <p className="text-primary font-mono text-sm mt-1">{k.key}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created: {k.createdAt}</span>
                          <span>Uses: {k.uses}</span>
                          <span className={k.enabled ? 'text-success' : 'text-destructive'}>
                            {k.enabled ? '● Enabled' : '● Disabled'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleKey(k.id)}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                          title={k.enabled ? 'Disable key' : 'Enable key'}
                        >
                          {k.enabled ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(k.key)}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { deleteKey(k.id); toast.success('Key deleted'); }}
                          className="p-2 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {accessKeys.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-8">No keys created yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'logs' && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Search Logs ({searchLogs.length})
            </h2>
            {searchLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No search logs yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-2 pr-4">User</th>
                      <th className="text-left py-2 pr-4">Endpoint</th>
                      <th className="text-left py-2 pr-4">Query</th>
                      <th className="text-left py-2 pr-4">Status</th>
                      <th className="text-left py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchLogs.map(log => (
                      <tr key={log.id} className="border-b border-border/50">
                        <td className="py-2 pr-4">{log.keyName}</td>
                        <td className="py-2 pr-4 font-mono text-primary">{log.endpoint}</td>
                        <td className="py-2 pr-4 font-mono text-xs">{log.query}</td>
                        <td className="py-2 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded ${log.status === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2 text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
