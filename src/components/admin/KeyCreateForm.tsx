import { useState } from 'react';
import { Plus, RefreshCw, Calendar, Gauge, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const KeyCreateForm = () => {
  const { addKey } = useAppStore();
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [scope, setScope] = useState('read');

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Key name is required');
      return;
    }
    await addKey(newName.trim(), newValue.trim() || undefined, {
      expiresAt: expiresAt || undefined,
      maxUses: maxUses ? parseInt(maxUses) : undefined,
      scope,
    });
    setNewName('');
    setNewValue('');
    setExpiresAt('');
    setMaxUses('');
    setScope('read');
    toast.success('Key created');
  };

  return (
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

      {/* Advanced options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/20">
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Expiry Date
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm input-glow-accent backdrop-blur-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Gauge className="w-3 h-3" /> Max Uses (Quota)
          </label>
          <input
            type="number"
            placeholder="Unlimited"
            value={maxUses}
            onChange={e => setMaxUses(e.target.value)}
            min="1"
            className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm input-glow-accent backdrop-blur-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Scope
          </label>
          <select
            value={scope}
            onChange={e => setScope(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm input-glow-accent backdrop-blur-sm"
          >
            <option value="read">Read-Only</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-all text-sm btn-shine glow-accent-sm hover:glow-accent"
      >
        <Plus className="w-4 h-4" /> Create Key
      </button>
    </div>
  );
};

export default KeyCreateForm;
