import React, { useState, useEffect } from 'react';
import { Bug, Play, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { ContaminationCheck } from '../types';
import { api } from '../services/api';

interface ContaminationPageProps {
  evaluationId: string;
}

export const ContaminationPage: React.FC<ContaminationPageProps> = ({ evaluationId }) => {
  const [checks, setChecks] = useState<ContaminationCheck[]>([]);
  const [customProbe, setCustomProbe] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<ContaminationCheck | null>(null);

  useEffect(() => {
    loadChecks();
  }, [evaluationId]);

  const loadChecks = async () => {
    try {
      const data = await api.listContaminationChecks(evaluationId);
      setChecks(data);
      if (data.length > 0) setLastCheck(data[0]);
    } catch (e) {}
  };

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await api.runContaminationCheck(evaluationId, customProbe || undefined);
      setLastCheck(res);
      setCustomProbe('');
      loadChecks();
    } catch (err: any) {
      alert(`Contamination check failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-white">CONTAMINATION TESTING CENTER</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              CANARY ISOLATION
            </span>
          </div>
          <p className="text-xs text-bayora-textMuted mt-0.5">
            Verifies that prior test context and session memory do not leak across evaluation runs.
          </p>
        </div>
      </div>

      {/* Trigger Box */}
      <form onSubmit={handleRunCheck} className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
        <div className="flex items-center justify-between border-b border-bayora-border pb-3">
          <span className="text-xs font-mono font-semibold text-white flex items-center gap-2">
            <Bug className="w-4 h-4 text-emerald-400" />
            <span>EXECUTE CROSS-SESSION CANARY PROBE</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Generates unique cryptographically random token
          </span>
        </div>

        <div>
          <label className="text-slate-400 text-[11px] font-mono block mb-1">
            CUSTOM PROBE QUERY (OPTIONAL)
          </label>
          <input
            type="text"
            placeholder="Leave empty to use standard zero-trust canary isolation probe..."
            value={customProbe}
            onChange={(e) => setCustomProbe(e.target.value)}
            className="w-full bg-bayora-bg border border-bayora-border rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-bayora-accent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isRunning}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'PROBING MEMORY ISOLATION...' : 'RUN CONTAMINATION CHECK'}</span>
          </button>
        </div>
      </form>

      {/* Latest Result Card */}
      {lastCheck && (
        <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">LATEST CANARY VERIFICATION</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              lastCheck.is_clean
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse'
            }`}>
              {lastCheck.is_clean ? '✓ CLEAN (NO CONTAMINATION)' : '⚠ RESIDUAL CONTEXT DETECTED'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border">
              <span className="text-slate-500 text-[10px]">CANARY TOKEN</span>
              <div className="text-cyan-400 font-bold mt-0.5">{lastCheck.canary_token}</div>
            </div>

            <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border">
              <span className="text-slate-500 text-[10px]">ISOLATION STATUS</span>
              <div className="text-emerald-400 font-bold mt-0.5">{lastCheck.isolation_status}</div>
            </div>

            <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border">
              <span className="text-slate-500 text-[10px]">CHECK TIMESTAMP</span>
              <div className="text-slate-300 mt-0.5">{new Date(lastCheck.created_at).toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border text-xs font-mono space-y-1">
            <span className="text-slate-500 text-[10px]">MODEL RESPONSE TO CANARY PROBE:</span>
            <div className="text-slate-200 leading-relaxed">{lastCheck.target_response}</div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">CONTAMINATION CHECK AUDIT LOG</h3>
          <span className="text-xs font-mono text-bayora-textMuted">{checks.length} Checks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bayora-border text-slate-500 text-[11px]">
                <th className="pb-3 font-medium">CHECK ID</th>
                <th className="pb-3 font-medium">CANARY TOKEN</th>
                <th className="pb-3 font-medium">STATUS</th>
                <th className="pb-3 font-medium">ISOLATION</th>
                <th className="pb-3 font-medium text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bayora-border/60">
              {checks.map((chk) => (
                <tr key={chk.id} className="hover:bg-bayora-cardHover/40 transition-colors">
                  <td className="py-3 text-white font-bold">{chk.id}</td>
                  <td className="py-3 text-cyan-400">{chk.canary_token}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      chk.is_clean ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {chk.is_clean ? 'CLEAN' : 'CONTAMINATED'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{chk.isolation_status}</td>
                  <td className="py-3 text-right text-slate-400">{new Date(chk.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
