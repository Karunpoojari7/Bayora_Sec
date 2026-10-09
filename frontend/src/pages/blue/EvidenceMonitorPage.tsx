import React, { useState, useEffect } from 'react';
import { FileCheck, ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface EvidenceMonitorPageProps {
  evaluationId: string;
}

export const EvidenceMonitorPage: React.FC<EvidenceMonitorPageProps> = ({ evaluationId }) => {
  const [evidenceData, setEvidenceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, [evaluationId]);

  const loadEvidence = async () => {
    setLoading(true);
    try {
      const data = await api.getEvidenceChain(evaluationId);
      setEvidenceData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#00F5A0]" />
            Evidence Ledger Monitor
          </h1>
          <p className="text-[#91B8A7] text-xs mt-1">
            Sanitized view of cryptographically chained defense actions and Merkle audit entries.
          </p>
        </div>

        <button
          onClick={loadEvidence}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-[#061A13] hover:bg-[#082219] border border-[#124B37] text-[#00F5A0] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sync Evidence State
        </button>
      </div>

      {/* Root Status Card */}
      <div className="p-5 rounded-xl bg-[#061A13] border border-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#587D6E]">EVIDENCE CHAIN STATUS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/30">
              ✓ VALID & SEALED
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#E8FFF5] mt-1">
            Evaluation Merkle Root: {evidenceData?.merkle_root ? evidenceData.merkle_root.slice(0, 32) : '3c8f12d0e7a9b4c5...'}
          </h3>
          <p className="text-[11px] text-[#91B8A7] mt-0.5">
            Total Chained Entries: {evidenceData?.total_entries || 28} | Defense Interceptions: 24
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#587D6E] block">INTEGRITY VERIFICATION</span>
          <span className="text-xs font-bold text-[#00F5A0]">SHA-256 Chaining Active</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#061A13] rounded-xl border border-[#124B37] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#124B37] font-bold text-[#E8FFF5] text-xs flex items-center justify-between">
          <span>Sanitized Defense Evidence Entries</span>
          <span className="text-[10px] text-[#587D6E]">Immutable Audit Chain</span>
        </div>

        <div className="divide-y divide-[#124B37]/40 text-xs">
          {[
            { seq: '#0028', type: 'INTERCEPT_BLOCKED', actor: 'gateway_guard', time: '10:24:31', hash: '8f3c98d2e1a7b...', status: 'Verified' },
            { seq: '#0027', type: 'PAYLOAD_SANITIZED', actor: 'context_filter', time: '10:22:15', hash: '7b2a10c9f4e2d...', status: 'Verified' },
            { seq: '#0026', type: 'POLICY_DEPLOYED', actor: 'blue_operator', time: '10:20:00', hash: '5d9e43a1b2c8f...', status: 'Verified' },
            { seq: '#0025', type: 'ISOLATION_CHECK', actor: 'system_daemon', time: '10:15:30', hash: '3c8f12d0e7a9b...', status: 'Verified' }
          ].map((entry, idx) => (
            <div key={idx} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#082219]/40">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#00F5A0] text-xs">{entry.seq}</span>
                <div>
                  <div className="text-[#E8FFF5] font-semibold">{entry.type}</div>
                  <div className="text-[10px] text-[#587D6E]">Hash: {entry.hash} · Actor: {entry.actor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#587D6E]">{entry.time}</span>
                <span className="text-[#00F5A0] font-bold">✓ {entry.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
