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
        <span className="text-xs font-mono text-[#718BA6] font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00A3FF]" />
          OFFICIAL VERIFICATION CERTIFICATE
        </span>
        <div className="flex items-center gap-2">
          {onExportJson && (
            <button
              onClick={onExportJson}
              className="px-3.5 py-1.5 rounded-lg bg-[#071729] hover:bg-[#0A1D31] border border-[#12324F] hover:border-[#087BDA] text-xs font-mono text-[#7FB6E8] hover:text-[#EAF4FF] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#00A3FF]" />
              <span>EXPORT JSON</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-[#087BFF] hover:bg-[#2395FF] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(8,123,255,0.4)] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Document */}
      <div className="p-8 rounded-2xl bg-[#071729] border border-[#087BDA] relative overflow-hidden shadow-[0_0_25px_rgba(8,123,218,0.2)]">
        {/* Watermark Logo */}
        <div className="absolute right-8 top-12 opacity-5 pointer-events-none text-[#00A3FF]">
          <Shield className="w-72 h-72" />
        </div>

        {/* Passport Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#12324F] pb-6 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#0A1D31] text-[#7FB6E8] border border-[#075AA0] font-bold">
                BAYORA ASSURANCE PASSPORT
              </span>
              <span className="text-[10px] font-mono text-[#19CDA5] font-bold flex items-center gap-1">
                ✓ CRYPTOGRAPHICALLY ATTESTED
              </span>
            </div>
            <h1 className="text-2xl font-mono font-extrabold text-[#F4F8FF] mt-2 tracking-wide">
              TEST INTEGRITY PASSPORT™
            </h1>
            <p className="text-xs text-[#A9C2DA] mt-1">
              Verifiable proof of adversarial evaluation isolation, contamination resistance, and cryptographic provenance.
            </p>
          </div>

          {/* Trust Score Badge */}
          <div className="p-4 rounded-xl bg-[#061321] border border-[#12324F] text-center min-w-[160px] shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#718BA6] font-bold">
              BAYORA TRUST SCORE
            </span>
            <div className="text-3xl font-mono font-black text-[#F4F8FF] mt-0.5">
              {passport.trust_score}
              <span className="text-sm font-normal text-[#718BA6]">/100</span>
            </div>
            <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isHighTrust 
                ? 'bg-[#00D6B5]/15 text-[#00D6B5] border-[#00D6B5]/30' 
                : 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30'
            }`}>
              {passport.trust_tier}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-[#12324F] text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#061321] border border-[#12324F]/60">
            <span className="text-[#718BA6] text-[10px] font-bold uppercase tracking-wider">EVALUATION ID</span>
            <div className="text-[#F4F8FF] font-bold mt-1 text-sm">{passport.evaluation_id}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#061321] border border-[#12324F]/60">
            <span className="text-[#718BA6] text-[10px] font-bold uppercase tracking-wider">TARGET MODEL</span>
            <div className="text-[#00A3FF] font-bold mt-1">{passport.model_identity} (v{passport.model_version})</div>
          </div>
          <div className="p-3 rounded-lg bg-[#061321] border border-[#12324F]/60">
            <span className="text-[#718BA6] text-[10px] font-bold uppercase tracking-wider">TEST SUITE METRICS</span>
            <div className="text-[#EAF4FF] font-medium mt-1">{passport.attack_count} Attacks / {passport.threats_mitigated} Mitigated</div>
          </div>
          <div className="p-3 rounded-lg bg-[#061321] border border-[#12324F]/60">
            <span className="text-[#718BA6] text-[10px] font-bold uppercase tracking-wider">ISSUANCE TIMESTAMP</span>
            <div className="text-[#A9C2DA] font-medium mt-1">{new Date(passport.issued_at).toUTCString()}</div>
          </div>
        </div>

        {/* 4 Core Zero-Trust Security Guarantees */}
        <div className="py-6 border-b border-[#12324F] space-y-3">
          <h4 className="text-xs font-mono font-bold text-[#7FB6E8] uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#00A3FF]" />
            ZERO-TRUST SECURITY GUARANTEES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#061321] border border-[#12324F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#19CDA5]" />
                <span className="text-[#EAF4FF] font-semibold">ISOLATION BOUNDARY</span>
              </div>
              <span className="text-[#19CDA5] font-bold">{passport.isolation_status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#061321] border border-[#12324F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#19CDA5]" />
                <span className="text-[#EAF4FF] font-semibold">CONTAMINATION STATUS</span>
              </div>
              <span className="text-[#19CDA5] font-bold">{passport.contamination_status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#061321] border border-[#12324F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#19CDA5]" />
                <span className="text-[#EAF4FF] font-semibold">EVIDENCE CHAIN</span>
              </div>
              <span className="text-[#19CDA5] font-bold">{passport.evidence_chain_status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#061321] border border-[#12324F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#19CDA5]" />
                <span className="text-[#EAF4FF] font-semibold">RESOURCE GOVERNOR</span>
              </div>
              <span className="text-[#19CDA5] font-bold">{passport.resource_fairness_status}</span>
            </div>
          </div>
        </div>

        {/* Residual Risk Disclosure */}
        <div className="py-5 border-b border-[#12324F] space-y-2 text-xs">
          <span className="text-xs font-mono font-bold text-[#FFB547] flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FFB547]" />
            RESIDUAL RISKS & BOUNDARY LIMITATIONS
          </span>
          <ul className="space-y-1 text-[#A9C2DA] font-mono text-[11px] list-disc list-inside bg-[#061321] p-3 rounded-lg border border-[#12324F]">
            {passport.residual_risks.map((risk, idx) => (
              <li key={idx} className="text-[#A9C2DA]">{risk}</li>
            ))}
          </ul>
        </div>

        {/* Cryptographic Attestation Footer */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
          <div className="space-y-1.5">
            <div className="text-[#718BA6]">
              EVIDENCE TIP HASH: <span className="text-[#7FB6E8] font-medium">{passport.evidence_tip_hash.slice(0, 32)}...</span>
            </div>
            <div className="text-[#718BA6]">
              PASSPORT ATTESTATION HASH: <span className="text-[#00A3FF] font-bold">{passport.cryptographic_passport_hash}</span>
            </div>
          </div>
          <div className="text-right text-[#718BA6]">
            <div>ATTESTED BY: <span className="text-[#F4F8FF] font-bold">{passport.verified_by}</span></div>
            <div className="text-[#19CDA5] font-bold mt-0.5">STATUS: VERIFIED & SEALED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
