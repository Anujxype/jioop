import { useState } from 'react';
import { Search, LogOut, User, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const API_BASE = 'https://anuapi.netlify.app/.netlify/functions/api';

const ENDPOINTS = [
  { name: 'Mobile Lookup', path: '/mobile', param: 'number', placeholder: 'Enter mobile number' },
  { name: 'Vehicle Lookup', path: '/vehicle', param: 'registration', placeholder: 'Enter registration number' },
  { name: 'General Query', path: '/v2', param: 'query', placeholder: 'Enter your query' },
];

const PortalPage = () => {
  const { isLoggedIn, currentKey, logout, addLog, incrementKeyUses } = useAppStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn || !currentKey) {
    navigate('/');
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a value');
      return;
    }
    setLoading(true);
    setResult(null);
    const ep = ENDPOINTS[selected];
    const url = `${API_BASE}${ep.path}?${ep.param}=${encodeURIComponent(query.trim())}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResult(data);
      incrementKeyUses(currentKey.id);
      addLog({ keyName: currentKey.name, endpoint: ep.path, query: query.trim(), status: 'success' });
    } catch {
      toast.error('API request failed');
      addLog({ keyName: currentKey.name, endpoint: ep.path, query: query.trim(), status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-50 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FastX Logo" className="w-8 h-8 drop-shadow-[0_0_8px_hsl(170_70%_45%/0.3)]" />
          <h1 className="text-xl font-bold text-gradient-primary">FastX Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary flex items-center gap-1.5 glass-card px-3 py-1.5 text-xs">
            <User className="w-3 h-3" /> {currentKey.name}
          </span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors hover-scale">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6 relative z-10">
        {/* Endpoint Grid */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-sm text-muted-foreground mb-3">Select Endpoint</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ENDPOINTS.map((ep, i) => (
              <button
                key={ep.path}
                onClick={() => { setSelected(i); setResult(null); setQuery(''); }}
                className={`p-4 rounded-lg border text-left transition-all duration-300 hover-lift relative ${
                  selected === i
                    ? 'border-primary/50 bg-primary/10 text-primary glow-primary-sm'
                    : 'border-border/40 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50'
                }`}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <p className={`font-semibold text-sm ${selected === i ? 'text-primary' : 'text-foreground'}`}>{ep.name}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{ep.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="glass-card p-6 space-y-4 animate-fade-in-up scanlines relative" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> {ENDPOINTS[selected].name}
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            GET {ENDPOINTS[selected].path}?{ENDPOINTS[selected].param}=&#123;value&#125;
          </p>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              placeholder={ENDPOINTS[selected].placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-input/80 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm input-glow backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 text-sm btn-shine glow-primary-sm hover:glow-primary"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="glass-card p-6 animate-fade-in-up relative scanlines">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Response</h3>
            <pre className="bg-muted/30 backdrop-blur-sm p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground whitespace-pre-wrap border border-border/30">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalPage;
