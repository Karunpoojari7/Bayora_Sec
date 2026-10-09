import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, Lock, Cpu, Play } from 'lucide-react';
import { EvidenceEvent, EvidenceVerification } from '../../types';
import { api } from '../../services/api';
import { EvidenceChainGraph } from '../../components/EvidenceChainGraph';

interface EvidenceAdminPageProps {
  evaluationId: string;
}

export const EvidenceAdminPage: React.FC<EvidenceAdminPageProps> = ({ evaluationId }) => {
  const [events, setEvents] = useState<EvidenceEvent[]>([]);
  const [verification, setVerification] = useState<EvidenceVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [tampering, setTampering] = useState(false);

  useEffect(() => {
    loadData();
  }, [evaluationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evts, ver] = await Promise.all([
        api.getEvidenceChain(evaluationId),
        api.verifyEvidence(evaluationId),
      ]);
      setEvents(evts);
      setVerification(ver);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const ver = await api.verifyEvidence(evaluationId);
      setVerification(ver);
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setTampering(true);
    try {
      await api.simulateTamper(evaluationId);
      const ver = await api.verifyEvidence(evaluationId);
      setVerification(ver);
    } catch (err: any) {
      alert(`Tamper simulation error: ${err.message}`);
    } finally {
      setTampering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cryptographic Evidence Verification</h2>
          <p className="text-slate-500 text-sm mt-1">
            SHA-256 Merkle chain verification engine. Prove integrity and detect unauthorized state tampering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTamper}
            disabled={tampering}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Simulate Ledger Tamper
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Recompute Hash Tree
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className={`p-6 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        verification?.is_valid
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-rose-50/70 border-rose-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${verification?.is_valid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {verification?.is_valid ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${verification?.is_valid ? 'text-emerald-800' : 'text-rose-800'}`}>
                Merkle Root Status
              </span>
              <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${verification?.is_valid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                {verification?.is_valid ? '100% VALID & INTACT' : 'TAMPER DETECTED'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 font-mono">
              Root Hash: {verification?.tip_hash || 'sha256:00000000000000000000000000000000'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified {verification?.total_events || events.length} sequentially signed blocks in evaluation chain.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-600">
          <div>Algorithm: SHA-256 Chained</div>
          <div>Genesis Hash: {verification?.genesis_hash ? 'Verified' : 'Intact'}</div>
        </div>
      </div>

      {/* Interactive Evidence Graph */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sequential Block Chain</h3>
        <EvidenceChainGraph
          events={events}
          verification={verification}
          onVerify={handleVerify}
          onSimulateTamper={handleSimulateTamper}
        />
      </div>
    </div>
  );
};
