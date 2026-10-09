import React from 'react';
import {
  ShieldCheck, Award, CheckCircle2, AlertTriangle,
  Download, Printer, Lock, FileText, QrCode, Cpu, Shield
} from 'lucide-react';
import { TestIntegrityPassport } from '../types';

interface PassportCardProps {
  passport: TestIntegrityPassport;
  onExportJson?: () => void;
}

export const PassportCard: React.FC<PassportCardProps> = ({ passport, onExportJson }) => {
  const handlePrint = () => {
    window.print();
  };

  const isHighTrust = passport.trust_score >= 80;

  return (
    <div className="space-y-4">
      {/* Export & Print Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-bayora-textMuted">
          OFFICIAL VERIFICATION CERTIFICATE
        </span>
        <div className="flex items-center gap-2">
          {onExportJson && (
            <button
              onClick={onExportJson}
              className="px-3 py-1.5 rounded-lg bg-bayora-card hover:bg-bayora-cardHover border border-bayora-border text-xs font-mono text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT JSON</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Document */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#080C14] border-2 border-blue-500/40 relative overflow-hidden shadow-2xl">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/20 to-transparent pointer-events-none" />
        
        {/* Watermark Logo */}
        <div className="absolute right-8 top-12 opacity-5 pointer-events-none">
          <Shield className="w-64 h-64 text-white" />
        </div>

        {/* Passport Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-bayora-border pb-6 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold">
                BAYORA ASSURANCE PASSPORT
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ✓ CRYPTOGRAPHICALLY ATTESTED
              </span>
            </div>
            <h1 className="text-2xl font-mono font-extrabold text-white mt-2 tracking-wide">
              TEST INTEGRITY PASSPORT
            </h1>
            <p className="text-xs text-bayora-textMuted mt-1">
              Verifiable proof of adversarial evaluation isolation, contamination resistance, and provenance.
            </p>
          </div>

          {/* Trust Score Badge */}
          <div className="p-4 rounded-2xl bg-bayora-bg/90 border border-blue-500/40 text-center min-w-[150px] shadow-lg shadow-blue-500/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-bayora-textMuted">
              BAYORA TRUST SCORE
            </span>
            <div className="text-3xl font-mono font-black text-white mt-0.5">
              {passport.trust_score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              isHighTrust ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {passport.trust_tier}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-bayora-border text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[11px]">EVALUATION ID</span>
            <div className="text-white font-bold mt-0.5 text-sm">{passport.evaluation_id}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">TARGET MODEL</span>
            <div className="text-cyan-400 font-bold mt-0.5">{passport.model_identity} (v{passport.model_version})</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">TEST SUITE PASS</span>
            <div className="text-slate-200 mt-0.5">{passport.attack_count} Attacks / {passport.threats_mitigated} Mitigated</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">ISSUANCE TIMESTAMP</span>
            <div className="text-slate-200 mt-0.5">{new Date(passport.issued_at).toUTCString()}</div>
          </div>
        </div>

        {/* 5 Core Trust Guarantees */}
        <div className="py-6 border-b border-bayora-border space-y-3">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            ZERO-TRUST SECURITY GUARANTEES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-bayora-bg/80 border border-bayora-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">ISOLATION BOUNDARY</span>
              </div>
              <span className="text-emerald-400 font-bold">{passport.isolation_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-bayora-bg/80 border border-bayora-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">CONTAMINATION STATUS</span>
              </div>
              <span className="text-emerald-400 font-bold">{passport.contamination_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-bayora-bg/80 border border-bayora-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">EVIDENCE CHAIN</span>
              </div>
              <span className="text-emerald-400 font-bold">{passport.evidence_chain_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-bayora-bg/80 border border-bayora-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">RESOURCE GOVERNOR</span>
              </div>
              <span className="text-emerald-400 font-bold">{passport.resource_fairness_status}</span>
            </div>
          </div>
        </div>

        {/* Residual Risk Disclosure */}
        <div className="py-5 border-b border-bayora-border space-y-2 text-xs">
          <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            RESIDUAL RISKS & BOUNDARY LIMITATIONS
          </span>
          <ul className="space-y-1 text-slate-400 font-mono text-[11px] list-disc list-inside">
            {passport.residual_risks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>

        {/* Cryptographic Attestation Footer */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
          <div className="space-y-1">
            <div className="text-slate-500">
              EVIDENCE TIP HASH: <span className="text-slate-300">{passport.evidence_tip_hash.slice(0, 32)}...</span>
            </div>
            <div className="text-slate-500">
              PASSPORT ATTESTATION HASH: <span className="text-cyan-400 font-bold">{passport.cryptographic_passport_hash}</span>
            </div>
          </div>
          <div className="text-right text-slate-500">
            <div>ATTESTED BY: <span className="text-white font-semibold">{passport.verified_by}</span></div>
            <div className="text-emerald-400">STATUS: VERIFIED & SEALED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
