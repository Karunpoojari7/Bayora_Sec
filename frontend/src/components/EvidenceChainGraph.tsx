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
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-mono">CRYPTOGRAPHIC EVIDENCE PROVENANCE</h3>
            {isValid ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> HASH CHAIN VALID
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 animate-pulse">
                <ShieldAlert className="w-3 h-3 text-red-600" /> TAMPERING DETECTED (SEQ #{verification?.tampered_event_seq})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {verification?.verification_message || `Total ${events.length} immutable events verified via sequential SHA-256.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateTamper}
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Simulate unauthorized database modification for demo"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>SIMULATE TAMPER (DEMO)</span>
          </button>

          <button
            onClick={onVerify}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>VERIFY CHAIN</span>
          </button>
        </div>
      </div>

      {/* Sequential Hash Chain Event Blocks */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 bg-white rounded-xl border border-slate-200">
            No evaluation events recorded yet.
          </div>
        ) : (
          events.map((evt, idx) => {
            const isGenesis = evt.event_seq === 0;
            const isTamperedNode = !isValid && verification?.tampered_event_seq === evt.event_seq;

            return (
              <React.Fragment key={evt.id}>
                <div
                  className={`p-4 rounded-xl bg-white border transition-all ${
                    isTamperedNode
                      ? 'border-red-400 bg-red-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-subtle'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                        SEQ #{evt.event_seq}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {evt.event_type}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {evt.actor}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Metadata preview */}
                  <div className="mt-2.5 p-2 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto">
                    {JSON.stringify(evt.metadata_json)}
                  </div>

                  {/* Cryptographic Linkage Info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>PREV:</span>
                      <span className="text-slate-700 truncate max-w-[150px] sm:max-w-none">
                        {isGenesis ? 'GENESIS (00000000...)' : evt.previous_event_hash.slice(0, 16) + '...'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link2 className="w-3 h-3 text-blue-600" />
                      <span className="text-slate-500">SHA-256:</span>
                      <span className="text-emerald-700 font-bold truncate max-w-[150px] sm:max-w-none">
                        {evt.event_hash.slice(0, 24)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector between events */}
                {idx < events.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
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
