import React from 'react';
import { ShieldCheck, ShieldAlert, Link2, RefreshCw, AlertTriangle, ArrowDown, Lock } from 'lucide-react';
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
      <div className={`p-4 rounded-xl border shadow-card flex flex-wrap items-center justify-between gap-4 ${
        isValid
          ? 'bg-[#071729] border-[#12324F]'
          : 'bg-[#1F0A10] border-[#FF3D59] shadow-[0_0_15px_rgba(255,61,89,0.3)]'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#F4F8FF] font-mono">CRYPTOGRAPHIC EVIDENCE PROVENANCE</h3>
            {isValid ? (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0A2926] text-[#00D6B5] border border-[#00D6B5]/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00D6B5]" /> HASH CHAIN VALID
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2E0F17] text-[#FF3D59] border border-[#FF3D59] flex items-center gap-1 animate-pulse">
                <ShieldAlert className="w-3 h-3 text-[#FF3D59]" /> TAMPERING DETECTED (SEQ #{verification?.tampered_event_seq})
              </span>
            )}
          </div>
          <p className="text-xs text-[#A9C2DA] mt-1 font-mono">
            {verification?.verification_message || `Total ${events.length} immutable events verified via sequential SHA-256.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateTamper}
            className="px-3 py-1.5 rounded-lg bg-[#1F0A10] hover:bg-[#2E0F17] border border-[#FF3D59]/50 text-[#FF3D59] text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Simulate unauthorized database modification for demo"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF3D59]" />
            <span>SIMULATE TAMPER</span>
          </button>

          <button
            onClick={onVerify}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-[#087BFF] hover:bg-[#2395FF] text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(8,123,255,0.3)] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>VERIFY CHAIN</span>
          </button>
        </div>
      </div>

      {/* Events Sequential Graph Flow */}
      <div className="space-y-3">
        {events.map((ev, idx) => {
          const isTampered = !isValid && verification?.tampered_event_seq === ev.event_seq;

          return (
            <div key={ev.id || idx} className="space-y-3">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isTampered
                    ? 'bg-[#1F0A10] border-[#FF3D59] shadow-[0_0_15px_rgba(255,61,89,0.35)]'
                    : 'bg-[#061321] border-[#12324F] hover:border-[#087BDA]'
                }`}
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#10283E]">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-[#F4F8FF]">BLOCK #{ev.event_seq}</span>
                    <span className="px-2 py-0.5 rounded bg-[#0A1D31] text-[#7FB6E8] border border-[#075AA0] text-[10px] uppercase font-bold">
                      {ev.event_type}
                    </span>
                  </div>

                  <span className="text-[#718BA6] font-mono text-[11px]">
                    {new Date(ev.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#718BA6] block text-[10px]">CURRENT SHA-256 HASH:</span>
                    <span className={`break-all text-[11px] font-bold ${isTampered ? 'text-[#FF3D59]' : 'text-[#00D6B5]'}`}>
                      {ev.event_hash}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#718BA6] block text-[10px]">PREVIOUS BLOCK HASH:</span>
                    <span className="text-[#7FB6E8] break-all text-[11px]">
                      {ev.previous_event_hash}
                    </span>
                  </div>
                </div>
              </div>

              {idx < events.length - 1 && (
                <div className="flex justify-center text-[#087BDA]">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
