import { useState } from 'react';
import { Shield, Key, LogIn } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = () => {
  const [accessKey, setAccessKey] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const { login, adminLogin } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(accessKey.trim())) {
      toast.success('Access granted');
      navigate('/portal');
    } else {
      toast.error('Invalid or disabled access key');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(adminPass.trim())) {
      toast.success('Admin access granted');
      navigate('/admin');
    } else {
      toast.error('Invalid admin password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-2 border-primary/50 flex items-center justify-center mb-6 glow-primary animate-pulse-glow">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">FastX</h1>
        <p className="text-muted-foreground mt-2">Secure Access Gateway</p>
      </div>

      {!showAdmin ? (
        <form onSubmit={handleLogin} className="glass-card p-8 w-full max-w-md space-y-6">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Key className="w-4 h-4 text-primary" /> Access Key
          </label>
          <input
            type="password"
            placeholder="Enter your access key"
            value={accessKey}
            onChange={e => setAccessKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" /> Access Portal
          </button>
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowAdmin(true)}
              className="w-full text-center text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Admin Access
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdminLogin} className="glass-card p-8 w-full max-w-md space-y-6">
          <button
            type="button"
            onClick={() => setShowAdmin(false)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            ← Back to Portal
          </button>
          <div className="flex flex-col items-center py-2">
            <div className="w-16 h-16 rounded-full border-2 border-accent/50 flex items-center justify-center mb-4 glow-accent">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-muted-foreground text-sm">Restricted Access</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Key className="w-4 h-4 text-accent" /> Admin Password
          </label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Shield className="w-4 h-4" /> Access Admin Panel
          </button>
        </form>
      )}

      <p className="text-muted-foreground text-xs mt-8">Protected by FastX Security Protocol</p>
    </div>
  );
};

export default LoginPage;
