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
        <span className="text-xs font-mono text-slate-500 font-semibold">
          OFFICIAL VERIFICATION CERTIFICATE
        </span>
        <div className="flex items-center gap-2">
          {onExportJson && (
            <button
              onClick={onExportJson}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-subtle"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>EXPORT JSON</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Document */}
      <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 relative overflow-hidden shadow-card">
        {/* Watermark Logo */}
        <div className="absolute right-8 top-12 opacity-5 pointer-events-none text-slate-900">
          <Shield className="w-64 h-64" />
        </div>

        {/* Passport Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                BAYORA ASSURANCE PASSPORT
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                ✓ CRYPTOGRAPHICALLY ATTESTED
              </span>
            </div>
            <h1 className="text-2xl font-mono font-extrabold text-slate-900 mt-2 tracking-wide">
              TEST INTEGRITY PASSPORT
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Verifiable proof of adversarial evaluation isolation, contamination resistance, and cryptographic provenance.
            </p>
          </div>

          {/* Trust Score Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[150px] shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              BAYORA TRUST SCORE
            </span>
            <div className="text-3xl font-mono font-black text-slate-900 mt-0.5">
              {passport.trust_score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              isHighTrust ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {passport.trust_tier}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[11px] font-semibold">EVALUATION ID</span>
            <div className="text-slate-900 font-bold mt-0.5 text-sm">{passport.evaluation_id}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-semibold">TARGET MODEL</span>
            <div className="text-blue-700 font-bold mt-0.5">{passport.model_identity} (v{passport.model_version})</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-semibold">TEST SUITE METRICS</span>
            <div className="text-slate-800 font-medium mt-0.5">{passport.attack_count} Attacks / {passport.threats_mitigated} Mitigated</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-semibold">ISSUANCE TIMESTAMP</span>
            <div className="text-slate-800 font-medium mt-0.5">{new Date(passport.issued_at).toUTCString()}</div>
          </div>
        </div>

        {/* 5 Core Trust Guarantees */}
        <div className="py-6 border-b border-slate-200 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            ZERO-TRUST SECURITY GUARANTEES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700 font-semibold">ISOLATION BOUNDARY</span>
              </div>
              <span className="text-emerald-700 font-bold">{passport.isolation_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700 font-semibold">CONTAMINATION STATUS</span>
              </div>
              <span className="text-emerald-700 font-bold">{passport.contamination_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700 font-semibold">EVIDENCE CHAIN</span>
              </div>
              <span className="text-emerald-700 font-bold">{passport.evidence_chain_status}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700 font-semibold">RESOURCE GOVERNOR</span>
              </div>
              <span className="text-emerald-700 font-bold">{passport.resource_fairness_status}</span>
            </div>
          </div>
        </div>

        {/* Residual Risk Disclosure */}
        <div className="py-5 border-b border-slate-200 space-y-2 text-xs">
          <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            RESIDUAL RISKS & BOUNDARY LIMITATIONS
          </span>
          <ul className="space-y-1 text-slate-600 font-mono text-[11px] list-disc list-inside">
            {passport.residual_risks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>

        {/* Cryptographic Attestation Footer */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
          <div className="space-y-1">
            <div className="text-slate-500">
              EVIDENCE TIP HASH: <span className="text-slate-800 font-medium">{passport.evidence_tip_hash.slice(0, 32)}...</span>
            </div>
            <div className="text-slate-500">
              PASSPORT ATTESTATION HASH: <span className="text-blue-700 font-bold">{passport.cryptographic_passport_hash}</span>
            </div>
          </div>
          <div className="text-right text-slate-500">
            <div>ATTESTED BY: <span className="text-slate-900 font-bold">{passport.verified_by}</span></div>
            <div className="text-emerald-700 font-bold">STATUS: VERIFIED & SEALED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
