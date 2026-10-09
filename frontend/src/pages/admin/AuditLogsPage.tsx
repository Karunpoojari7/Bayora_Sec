import React, { useState, useEffect } from 'react';
import { FileText, Shield, Search, Filter, RefreshCw, Lock, UserCheck } from 'lucide-react';
import { api } from '../../services/api';

interface AuditLogsPageProps {
  evaluationId: string;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ evaluationId }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, [evaluationId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const chain = await api.getEvidenceChain(evaluationId);
      setLogs(chain || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const s = search.toLowerCase();
    return !search ||
      (l.event_type && l.event_type.toLowerCase().includes(s)) ||
      (l.actor && l.actor.toLowerCase().includes(s)) ||
      (l.event_id && l.event_id.toLowerCase().includes(s));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Audit Logs & Ledger</h2>
          <p className="text-slate-500 text-sm mt-1">
            Tamper-evident audit trail of authentication events, policy alterations, probe executions, and disclosures.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Ledger
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by event type, actor username, or event ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 w-full md:w-96"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Audit Ledger Entries ({filteredLogs.length})
          </span>
          <span className="text-xs text-slate-400 font-mono">SHA-256 Chained</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Verifying and loading audit events...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No audit logs recorded for this evaluation yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3">Sequence</th>
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Hash Signature</th>
                  <th className="px-4 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {filteredLogs.map((ev, i) => (
                  <tr key={ev.event_id || i} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-bold text-slate-700">#{ev.sequence_number ?? i + 1}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold">
                        {ev.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-sans font-medium">{ev.actor || 'system'}</td>
                    <td className="px-4 py-3.5 text-slate-500 truncate max-w-xs">{ev.current_hash}</td>
                    <td className="px-4 py-3.5 text-right text-slate-400 font-sans">
                      {new Date(ev.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
