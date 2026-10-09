import React from 'react';
import { ShieldCheck, ShieldAlert, Link2, RefreshCw, AlertTriangle, ArrowDown } from 'lucide-react';
import { EvidenceEvent, EvidenceVerification } from '../types';

interface EvidenceChainGraphProps {
  events: EvidenceEvent[];
  verification?: EvidenceVerification;
  onVerify: () => void;
  onSimulateTamper: () => void;
  isLoading?: boolean;
}

export const EvidenceChainGraph: React.FC<EvidenceChainGraphProps> = ({
  events,
  verification,
  onVerify,
  onSimulateTamper,
  isLoading = false,
}) => {
  const isValid = verification?.is_valid ?? true;

  return (
    <div className="space-y-4">
      {/* Control & Verification Header */}
      <div className="p-4 rounded-xl bg-bayora-card border border-bayora-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">CRYPTOGRAPHIC EVIDENCE PROVENANCE</h3>
            {isValid ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> HASH CHAIN VALID
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                <ShieldAlert className="w-3 h-3" /> TAMPERING DETECTED (SEQ #{verification?.tampered_event_seq})
              </span>
            )}
          </div>
          <p className="text-xs text-bayora-textMuted mt-1">
            {verification?.verification_message || `Total ${events.length} immutable events verified via SHA-256.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateTamper}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono transition-all flex items-center gap-1.5"
            title="Simulate unauthorized database modification for demo"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE TAMPER (DEMO)</span>
          </button>

          <button
            onClick={onVerify}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-bayora-accent hover:bg-blue-600 text-white text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>VERIFY CHAIN</span>
          </button>
        </div>
      </div>

      {/* Sequential Hash Chain Event Blocks */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-bayora-textMuted bg-bayora-card rounded-xl border border-bayora-border">
            No evaluation events recorded yet.
          </div>
        ) : (
          events.map((evt, idx) => {
            const isGenesis = evt.event_seq === 0;
            const isTamperedNode = !isValid && verification?.tampered_event_seq === evt.event_seq;

            return (
              <React.Fragment key={evt.id}>
                <div
                  className={`p-4 rounded-xl bg-bayora-card border transition-all ${
                    isTamperedNode
                      ? 'border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-500/20'
                      : 'border-bayora-border hover:border-bayora-borderHighlight'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bayora-bg border border-bayora-border text-cyan-400">
                        SEQ #{evt.event_seq}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white">
                        {evt.event_type}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {evt.actor}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-bayora-textMuted">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Metadata preview */}
                  <div className="mt-2.5 p-2 rounded bg-bayora-bg/80 border border-bayora-border/50 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {JSON.stringify(evt.metadata_json)}
                  </div>

                  {/* Cryptographic Linkage Info */}
                  <div className="mt-3 pt-2.5 border-t border-bayora-border flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-slate-500">PREV:</span>
                      <span className="text-slate-300 truncate max-w-[150px] sm:max-w-none">
                        {isGenesis ? 'GENESIS (00000000...)' : evt.previous_event_hash.slice(0, 16) + '...'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link2 className="w-3 h-3 text-cyan-400" />
                      <span className="text-slate-500">SHA-256:</span>
                      <span className="text-emerald-400 font-bold truncate max-w-[150px] sm:max-w-none">
                        {evt.event_hash.slice(0, 24)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector between events */}
                {idx < events.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-500/50" />
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};
