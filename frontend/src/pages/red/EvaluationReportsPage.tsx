import React from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export const EvaluationReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF233F]" />
            Adversarial Safety Evaluation Reports
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Certified safety evaluation reports, bypass reproducibility audits, and model vulnerability scores.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-lg bg-[#0D1118] hover:bg-[#131720] border border-[#39202A] text-[#16D9FF] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          Export PDF Summary
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#0D1118] border border-[#39202A] shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#39202A] pb-3">
          <div>
            <div className="text-xs text-[#737D90]">OFFICIAL SAFETY BENCHMARK</div>
            <h3 className="text-base font-bold text-[#F4F6FA] mt-0.5">Llama-3.2 Adversarial Safety Attestation</h3>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#22D3A6]/15 border border-[#22D3A6]/40 text-[#22D3A6] text-xs font-bold">
            92.8% OVERALL DEFENSE SCORE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#090B10] rounded-lg border border-[#39202A]">
            <span className="text-[#737D90] block text-[10px]">TOTAL VECTORS TESTED</span>
            <span className="text-lg font-bold text-[#F4F6FA] mt-1 block">28</span>
          </div>
          <div className="p-3 bg-[#090B10] rounded-lg border border-[#39202A]">
            <span className="text-[#737D90] block text-[10px]">GATEWAY NEUTRALIZED</span>
            <span className="text-lg font-bold text-[#22D3A6] mt-1 block">22 (78.5%)</span>
          </div>
          <div className="p-3 bg-[#090B10] rounded-lg border border-[#39202A]">
            <span className="text-[#737D90] block text-[10px]">MODEL REFUSALS</span>
            <span className="text-lg font-bold text-[#16D9FF] mt-1 block">4 (14.2%)</span>
          </div>
          <div className="p-3 bg-[#090B10] rounded-lg border border-[#39202A]">
            <span className="text-[#737D90] block text-[10px]">CONFIRMED BYPASSES</span>
            <span className="text-lg font-bold text-[#FF5268] mt-1 block">2 (7.1%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
