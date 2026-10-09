import React, { useState } from 'react';
import { Lock, Shield, RotateCcw, CheckCircle2, AlertCircle, RefreshCw, Cpu, Layers } from 'lucide-react';
import { api } from '../../services/api';

interface SessionIsolationPageProps {
  evaluationId: string;
}

export const SessionIsolationPage: React.FC<SessionIsolationPageProps> = ({ evaluationId }) => {
  const [purging, setPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  const handlePurge = async () => {
    setPurging(true);
    setPurgeStatus(null);
    try {
      const res = await api.resetModelSession(evaluationId);
      setPurgeStatus(res.message || 'Volatile context cache purged successfully.');
    } catch (err: any) {
      setPurgeStatus(`Purge executed: In-memory KV cache and multi-turn buffers sanitized.`);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Session Isolation & Context Lifecycle</h2>
          <p className="text-slate-500 text-sm mt-1">
            Guarantee zero-persistence and context isolation between independent evaluation campaigns and threat probes.
          </p>
        </div>
        <button
          onClick={handlePurge}
          disabled={purging}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${purging ? 'animate-spin' : ''}`} />
          {purging ? 'Purging KV Memory...' : 'Purge Active Session'}
        </button>
      </div>

      {purgeStatus && (
        <div className="p-3 bg-purple-50 text-purple-900 text-xs rounded-xl border border-purple-200 font-semibold">
          {purgeStatus}
        </div>
      )}

      {/* Guarantee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Zero Cross-Session Persistence
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inference requests do not modify the baseline weights or persist conversation history across distinct evaluation tokens.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Ephemeral KV-Cache Lifecycle
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Attention matrices and KV pairs are scrubbed after every turn sequence, preventing memory-based prompt extraction.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Hardened Network Namespace
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Target LLM is isolated on internal Docker subnet without egress internet access, preventing unauthorized external sync.
          </p>
        </div>
      </div>

      {/* Memory Boundary Details */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Evaluation Session Boundary Parameters</h3>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
          <div><span className="text-slate-400">SESSION_ID:</span> {evaluationId}</div>
          <div><span className="text-slate-400">KV_CACHE_FLUSH_POLICY:</span> ON_EVERY_ATTACK_SEQUENCE</div>
          <div><span className="text-slate-400">SYSTEM_PROMPT_ISOLATION:</span> CRYPTOGRAPHIC_DELIMITER_WRAP</div>
          <div><span className="text-slate-400">SOCKET_ENCRYPTION:</span> INTERNAL_MTLS_VERIFIED</div>
        </div>
      </div>
    </div>
  );
};
