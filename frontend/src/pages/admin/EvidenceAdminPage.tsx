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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F4F8FF] tracking-tight">Cryptographic Evidence Verification</h1>
          <p className="text-[#718BA6] text-xs mt-1">
            SHA-256 Merkle chain verification engine. Prove integrity and detect unauthorized state tampering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTamper}
            disabled={tampering}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-[#FF3D59] bg-[#1F0A10] border border-[#FF3D59]/50 rounded-lg hover:bg-[#2E0F17] transition-colors shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D59]" />
            Simulate Ledger Tamper
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#087BFF] hover:bg-[#2395FF] text-white text-xs font-mono font-bold rounded-lg transition-colors shadow-[0_0_12px_rgba(8,123,255,0.35)] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recompute Hash Tree
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className={`p-6 rounded-xl border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        verification?.is_valid
          ? 'bg-[#071729] border-[#00D6B5] shadow-[0_0_15px_rgba(0,214,181,0.2)]'
          : 'bg-[#1F0A10] border-[#FF3D59] shadow-[0_0_15px_rgba(255,61,89,0.3)]'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${verification?.is_valid ? 'bg-[#0A2926] text-[#00D6B5] border border-[#00D6B5]/40' : 'bg-[#2E0F17] text-[#FF3D59] border border-[#FF3D59]'}`}>
            {verification?.is_valid ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${verification?.is_valid ? 'text-[#00D6B5]' : 'text-[#FF3D59]'}`}>
                Merkle Root Status
              </span>
              <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${verification?.is_valid ? 'bg-[#0A2926] text-[#00D6B5]' : 'bg-[#2E0F17] text-[#FF3D59]'}`}>
                {verification?.is_valid ? '100% VALID & INTACT' : 'TAMPER DETECTED'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F4F8FF] mt-1 font-mono">
              Root Hash: {verification?.tip_hash || 'sha256:00000000000000000000000000000000'}
            </h3>
            <p className="text-xs text-[#A9C2DA] mt-0.5 font-mono">
              Verified {verification?.total_events || events.length} sequentially signed blocks in evaluation chain.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-[#7FB6E8]">
          <div>Algorithm: SHA-256 Chained</div>
          <div>Genesis Hash: {verification?.genesis_hash ? 'Verified' : 'Intact'}</div>
        </div>
      </div>

      {/* Interactive Evidence Graph */}
      <div className="bg-[#071729] rounded-xl border border-[#12324F] shadow-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wider font-mono">Sequential Block Chain Ledger</h2>
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
