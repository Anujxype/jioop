import { useState } from 'react';
import { Shield, Key, LogIn } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-grid relative overflow-hidden p-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.2s' }} />

      <div className="mb-8 flex flex-col items-center animate-fade-in">
        <div className="animate-float mb-6">
          <img src={logo} alt="FastX Logo" className="w-20 h-20 drop-shadow-[0_0_15px_hsl(170_70%_45%/0.3)]" />
        </div>
        <h1 className="text-4xl font-bold text-gradient-primary tracking-tight">FastX</h1>
        <p className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Secure Access Gateway</p>
      </div>

      {!showAdmin ? (
        <form onSubmit={handleLogin} className="glass-card gradient-border p-8 w-full max-w-md space-y-6 animate-scale-in relative">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Key className="w-4 h-4 text-primary" /> Access Key
          </label>
          <input
            type="password"
            placeholder="Enter your access key"
            value={accessKey}
            onChange={e => setAccessKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm input-glow backdrop-blur-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all btn-shine glow-primary-sm hover:glow-primary"
          >
            <LogIn className="w-4 h-4" /> Access Portal
          </button>
          <div className="border-t border-border/30 pt-4">
            <button
              type="button"
              onClick={() => setShowAdmin(true)}
              className="w-full text-center text-muted-foreground hover:text-accent transition-colors text-sm hover-scale"
            >
              Admin Access
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdminLogin} className="glass-card-accent gradient-border p-8 w-full max-w-md space-y-6 animate-scale-in relative">
          <button
            type="button"
            onClick={() => setShowAdmin(false)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            ← Back to Portal
          </button>
          <div className="flex flex-col items-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-2 border-accent/30 flex items-center justify-center mb-4 glow-accent animate-glow-pulse">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-gradient-accent">Admin Panel</h2>
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
            className="w-full px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm input-glow-accent backdrop-blur-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all btn-shine glow-accent-sm hover:glow-accent"
          >
            <Shield className="w-4 h-4" /> Access Admin Panel
          </button>
        </form>
      )}

      <p className="text-muted-foreground text-xs mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        Protected by FastX Security Protocol
      </p>
    </div>
  );
};

export default LoginPage;
