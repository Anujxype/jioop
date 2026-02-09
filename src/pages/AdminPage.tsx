import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Copy, RefreshCw, LogOut, Key, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const AdminPage = () => {
  const { isAdmin, accessKeys, searchLogs, logout, addKey, deleteKey, toggleKey, loadKeys, loadLogs } = useAppStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'keys' | 'logs'>('keys');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    loadKeys();
    loadLogs();
  }, [loadKeys, loadLogs]);

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Key name is required');
      return;
    }
    await addKey(newName.trim(), newValue.trim() || undefined);
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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[400px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FastX Logo" className="w-8 h-8 drop-shadow-[0_0_8px_hsl(38_90%_50%/0.3)]" />
          <h1 className="text-xl font-bold text-gradient-accent">FastX Admin</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm hover-scale">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setTab('keys')}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
              tab === 'keys'
                ? 'bg-accent/15 text-accent border border-accent/30 glow-accent-sm'
                : 'bg-card/30 backdrop-blur-sm text-secondary-foreground hover:bg-card/50 border border-border/30'
            }`}
          >
            <Key className="w-4 h-4" /> Access Keys
          </button>
          <button
            onClick={() => setTab('logs')}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
              tab === 'logs'
                ? 'bg-primary/15 text-primary border border-primary/30 glow-primary-sm'
                : 'bg-card/30 backdrop-blur-sm text-secondary-foreground hover:bg-card/50 border border-border/30'
            }`}
          >
            <FileText className="w-4 h-4" /> Search Logs
          </button>
        </div>

        {tab === 'keys' && (
          <>
            {/* Create Key */}
            <div className="glass-card-accent p-6 space-y-4 animate-fade-in-up relative scanlines" style={{ animationDelay: '0.15s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm input-glow-accent backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Key Value (auto-generated if empty)</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Auto-generated"
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm input-glow-accent backdrop-blur-sm"
                    />
                    <button
                      onClick={() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        let r = 'fx_';
                        for (let i = 0; i < 24; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
                        setNewValue(r);
                      }}
                      className="px-3 py-3 rounded-lg border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/30 transition-all hover-scale bg-card/30 backdrop-blur-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-all text-sm btn-shine glow-accent-sm hover:glow-accent"
              >
                <Plus className="w-4 h-4" /> Create Key
              </button>
            </div>

            {/* Keys List */}
            <div className="glass-card p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> Active Keys ({accessKeys.length})
                </h2>
              </div>
              <div className="space-y-3">
                {accessKeys.map((k, i) => (
                  <div
                    key={k.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover-lift relative ${
                      k.enabled
                        ? 'bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/30'
                        : 'bg-muted/20 backdrop-blur-sm border-border/20 opacity-60'
                    }`}
                    style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                  >
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
                          className="p-2 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground transition-all hover-scale bg-card/30 backdrop-blur-sm"
                          title={k.enabled ? 'Disable key' : 'Enable key'}
                        >
                          {k.enabled ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(k.key)}
                          className="p-2 rounded-lg border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover-scale bg-card/30 backdrop-blur-sm"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => { await deleteKey(k.id); toast.success('Key deleted'); }}
                          className="p-2 rounded-lg border border-border/40 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all hover-scale bg-card/30 backdrop-blur-sm"
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
          <div className="glass-card p-6 space-y-4 animate-fade-in-up relative scanlines">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Search Logs ({searchLogs.length})
            </h2>
            {searchLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No search logs yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="text-left py-3 pr-4">User</th>
                      <th className="text-left py-3 pr-4">Endpoint</th>
                      <th className="text-left py-3 pr-4">Query</th>
                      <th className="text-left py-3 pr-4">Status</th>
                      <th className="text-left py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchLogs.map((log, i) => (
                      <tr
                        key={log.id}
                        className="border-b border-border/20 hover:bg-card/30 transition-colors"
                        style={{ animationDelay: `${i * 0.03}s` }}
                      >
                        <td className="py-3 pr-4">{log.keyName}</td>
                        <td className="py-3 pr-4 font-mono text-primary">{log.endpoint}</td>
                        <td className="py-3 pr-4 font-mono text-xs">{log.query}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${
                            log.status === 'success'
                              ? 'bg-success/15 text-success border border-success/20'
                              : 'bg-destructive/15 text-destructive border border-destructive/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleString()}</td>
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
