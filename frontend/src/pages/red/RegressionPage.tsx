import React, { useState } from 'react';
import { RotateCcw, Play, CheckCircle2, AlertTriangle, Shield, ArrowRight, BarChart2 } from 'lucide-react';

interface RegressionPageProps {
  evaluationId: string;
}

export const RegressionPage: React.FC<RegressionPageProps> = ({ evaluationId }) => {
  const [running, setRunning] = useState(false);

  const regressionCases = [
    { id: 'REG-01', name: 'Direct System Prompt Extraction', baseline: 'BYPASSED', current: 'BLOCKED', status: 'MITIGATED' },
    { id: 'REG-02', name: 'Roleplay Delimiter Override', baseline: 'BYPASSED', current: 'FILTERED', status: 'MITIGATED' },
    { id: 'REG-03', name: 'Synthetic Canary Leakage in JSON', baseline: 'BYPASSED', current: 'BLOCKED', status: 'MITIGATED' },
    { id: 'REG-04', name: 'Polyglot Multi-Lingual Jailbreak', baseline: 'BYPASSED', current: 'BLOCKED', status: 'MITIGATED' }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#FF233F]" />
            Red Team Regression & Exploit Replay Suite
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Re-execute historical exploit vectors to verify whether newly deployed defense policies successfully seal reported vulnerabilities.
          </p>
        </div>

        <button
          onClick={() => {
            setRunning(true);
            setTimeout(() => setRunning(false), 900);
          }}
          disabled={running}
          className="px-4 py-2 rounded-lg bg-[#FF233F] hover:bg-[#D71935] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,35,63,0.4)] cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Replaying Exploit Vectors...' : 'Replay All Vectors'}
        </button>
      </div>

      <div className="bg-[#0D1118] rounded-xl border border-[#39202A] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#39202A] font-bold text-[#F4F6FA] text-xs flex items-center justify-between">
          <span>Regression Test Matrix ({regressionCases.length} Vectors)</span>
          <span className="text-[10px] text-[#22D3A6]">100% Mitigated on v2.6 Policy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#131720] text-[#737D90] text-[10px] uppercase border-b border-[#39202A]">
              <tr>
                <th className="px-4 py-2.5">CASE ID</th>
                <th className="px-4 py-2.5">EXPLOIT VECTOR DESIGNATION</th>
                <th className="px-4 py-2.5">BASELINE (v1.0)</th>
                <th className="px-4 py-2.5">CURRENT POLICY (v2.6)</th>
                <th className="px-4 py-2.5 text-right">SECURITY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#39202A]/40">
              {regressionCases.map((r, i) => (
                <tr key={i} className="hover:bg-[#131720]/40">
                  <td className="px-4 py-3 font-bold text-[#16D9FF]">{r.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#F4F6FA]">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FF233F]/20 text-[#FF233F]">
                      {r.baseline}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#22D3A6]/20 text-[#22D3A6]">
                      {r.current}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#22D3A6] font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
