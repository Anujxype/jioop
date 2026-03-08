import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, RefreshCw, LogOut, Key, FileText, ToggleLeft, ToggleRight, Calendar, Gauge, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import ThemeToggle from '@/components/ThemeToggle';
import KeyCreateForm from '@/components/admin/KeyCreateForm';
import KeyList from '@/components/admin/KeyList';
import LogsTable from '@/components/admin/LogsTable';

const AdminPage = () => {
  const { isAdmin, accessKeys, searchLogs, logout, loadKeys, loadLogs } = useAppStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'keys' | 'logs'>('keys');

  useEffect(() => {
    loadKeys();
    loadLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <div className="fixed top-0 right-0 w-[500px] h-[400px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FastX Logo" className="w-8 h-8 drop-shadow-[0_0_8px_hsl(38_90%_50%/0.3)]" />
          <h1 className="text-xl font-bold text-gradient-accent">FastX Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm hover-scale">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
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
            <KeyCreateForm />
            <KeyList keys={accessKeys} />
          </>
        )}

        {tab === 'logs' && <LogsTable logs={searchLogs} />}
      </div>
    </div>
  );
};

export default AdminPage;
