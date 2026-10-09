import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, X, Eye, KeyRound, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { AttackPayload, Role } from '../types';

interface PayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationId: string;
  attackId: string;
  currentRole: Role;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({
  isOpen,
  onClose,
  evaluationId,
  attackId,
  currentRole,
}) => {
  const [payload, setPayload] = useState<AttackPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && attackId) {
      loadPayload();
    } else {
      setPayload(null);
      setError(null);
    }
  }, [isOpen, attackId, currentRole]);

  const loadPayload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConfidentialPayload(evaluationId, attackId);
      setPayload(data);
    } catch (err: any) {
      setError(err.message || 'Access Denied: Lacks red:read_payload capability');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bayora-card border border-bayora-border w-full max-w-lg rounded-2xl p-6 relative shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-bayora-border">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase">
              CONFIDENTIAL ATTACK PAYLOAD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-bayora-textMuted hover:text-white hover:bg-bayora-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Control Notice */}
        <div className="p-3 rounded-lg bg-bayora-bg border border-bayora-border text-xs font-mono space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">REQUESTING ACTOR:</span>
            <span className={`font-bold ${currentRole === 'RED_TEAM' || currentRole === 'ADMIN' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">REQUIRED CAPABILITY:</span>
            <span className="text-amber-400">red:read_payload</span>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-bayora-textMuted">
            Authenticating capability token...
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>ZERO-TRUST POLICY VIOLATION</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {error}
            </p>
            <p className="text-[10px] text-rose-400/80 pt-1 border-t border-rose-500/20">
              Blue Team and Viewer roles are strictly prohibited from viewing raw confidential Red Team payloads prior to authorized disclosure.
            </p>
          </div>
        ) : payload ? (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-500 text-[10px]">PAYLOAD ID:</span>
              <div className="text-white font-bold">{payload.id}</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">RAW ADVERSARIAL PROMPT:</span>
              <div className="mt-1 p-3 rounded-xl bg-bayora-bg border border-bayora-border text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                {payload.prompt_text}
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-bayora-border">
              <span>SHA-256:</span>
              <span className="text-emerald-400 font-bold">{payload.payload_hash}</span>
            </div>
          </div>
        ) : null}

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bayora-bg hover:bg-bayora-cardHover border border-bayora-border text-xs font-mono text-white transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
