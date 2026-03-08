import { Copy, Trash2, ToggleLeft, ToggleRight, Calendar, Gauge, Shield } from 'lucide-react';
import { Key } from 'lucide-react';
import { useAppStore, AccessKey } from '@/store/useAppStore';
import { toast } from 'sonner';

interface KeyListProps {
  keys: AccessKey[];
}

const KeyList = ({ keys }: KeyListProps) => {
  const { deleteKey, toggleKey } = useAppStore();

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  const getExpiryStatus = (key: AccessKey) => {
    if (!key.expiresAt) return null;
    const days = Math.ceil((new Date(key.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { label: 'Expired', color: 'text-destructive' };
    if (days <= 7) return { label: `${days}d left`, color: 'text-warning' };
    return { label: new Date(key.expiresAt).toLocaleDateString(), color: 'text-muted-foreground' };
  };

  const getQuotaStatus = (key: AccessKey) => {
    if (!key.maxUses) return null;
    const pct = (key.uses / key.maxUses) * 100;
    if (pct >= 100) return { label: `${key.uses}/${key.maxUses}`, color: 'text-destructive', pct: 100 };
    if (pct >= 80) return { label: `${key.uses}/${key.maxUses}`, color: 'text-warning', pct };
    return { label: `${key.uses}/${key.maxUses}`, color: 'text-muted-foreground', pct };
  };

  return (
    <div className="glass-card p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" /> Active Keys ({keys.length})
        </h2>
      </div>
      <div className="space-y-3">
        {keys.map((k, i) => {
          const expiry = getExpiryStatus(k);
          const quota = getQuotaStatus(k);

          return (
            <div
              key={k.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover-lift relative ${
                k.enabled
                  ? 'bg-card/30 backdrop-blur-sm border-border/40 hover:border-primary/30'
                  : 'bg-muted/20 backdrop-blur-sm border-border/20 opacity-60'
              }`}
              style={{ animationDelay: `${0.3 + i * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{k.name}</p>
                    {k.scope && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-primary/10 text-primary border border-primary/20">
                        {k.scope}
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-mono text-sm mt-1">{k.key}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>Created: {k.createdAt}</span>
                    <span>Uses: {k.uses}</span>
                    <span className={k.enabled ? 'text-success' : 'text-destructive'}>
                      {k.enabled ? '● Enabled' : '● Disabled'}
                    </span>
                    {expiry && (
                      <span className={`flex items-center gap-1 ${expiry.color}`}>
                        <Calendar className="w-3 h-3" /> {expiry.label}
                      </span>
                    )}
                  </div>

                  {/* Quota bar */}
                  {quota && (
                    <div className="mt-2 flex items-center gap-2">
                      <Gauge className="w-3 h-3 text-muted-foreground" />
                      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden max-w-[200px]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            quota.pct >= 100 ? 'bg-destructive' : quota.pct >= 80 ? 'bg-warning' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(quota.pct, 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs ${quota.color}`}>{quota.label}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
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
          );
        })}
        {keys.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No keys created yet</p>
        )}
      </div>
    </div>
  );
};

export default KeyList;
