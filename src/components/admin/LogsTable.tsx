import { FileText } from 'lucide-react';
import { SearchLog } from '@/store/useAppStore';

interface LogsTableProps {
  logs: SearchLog[];
}

const LogsTable = ({ logs }: LogsTableProps) => {
  return (
    <div className="glass-card p-6 space-y-4 animate-fade-in-up relative scanlines">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> Search Logs ({logs.length})
      </h2>
      {logs.length === 0 ? (
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
              {logs.map((log, i) => (
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
  );
};

export default LogsTable;
