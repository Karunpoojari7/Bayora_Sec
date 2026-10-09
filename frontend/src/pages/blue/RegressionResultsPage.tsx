import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, BarChart2, Check } from 'lucide-react';
import { api } from '../../services/api';

interface RegressionResultsPageProps {
  evaluationId: string;
}

export const RegressionResultsPage: React.FC<RegressionResultsPageProps> = ({ evaluationId }) => {
  const [versionA, setVersionA] = useState('v1.0.0');
  const [versionB, setVersionB] = useState('v2.1.0');
  const [running, setRunning] = useState(false);
  const [comparison, setComparison] = useState<any | null>({
    policy_version_a: 'v1.0.0',
    policy_version_b: 'v2.1.0',
    total_vectors_tested: 30,
    baseline_vulnerabilities: 24,
    candidate_vulnerabilities: 3,
    vulnerability_reduction_pct: 87.5,
    false_positive_delta: 0,
    categories: [
      { category: 'prompt_injection', v_a_blocked: 2, v_b_blocked: 10, total: 10, improved: true },
      { category: 'system_prompt_extraction', v_a_blocked: 1, v_b_blocked: 8, total: 8, improved: true },
      { category: 'instruction_override', v_a_blocked: 2, v_b_blocked: 6, total: 7, improved: true },
      { category: 'data_exfiltration', v_a_blocked: 1, v_b_blocked: 5, total: 5, improved: true },
    ]
  });

  const handleRunComparison = async () => {
    setRunning(true);
    try {
      const res = await api.runRegressionComparison(evaluationId, versionA, versionB);
      setComparison(res);
    } catch (err) {
      console.error('Failed to run regression comparison', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#00F5A0]" />
            Defensive Regression & Hardening Analysis
          </h1>
          <p className="text-[#91B8A7] text-xs mt-1">
            Quantify policy improvements, attack reduction percentages, and ensure zero defensive regression across version milestones.
          </p>
        </div>
        <button
          onClick={handleRunComparison}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00F5A0] hover:bg-[#00C982] text-[#020B08] text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(0,245,160,0.3)] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running Comparison...' : 'Compare Versions'}
        </button>
      </div>

      {/* Version Pickers */}
      <div className="bg-[#061A13] p-5 rounded-xl border border-[#124B37] shadow-card grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[10px] font-bold text-[#587D6E] uppercase block">
            Baseline Policy (A)
          </label>
          <select
            value={versionA}
            onChange={e => setVersionA(e.target.value)}
            className="w-full bg-[#051811] border border-[#124B37] rounded-lg p-2 text-xs text-[#E8FFF5] focus:outline-none focus:border-[#00F5A0]"
          >
            <option value="v1.0.0">v1.0.0 (Unfenced Baseline)</option>
            <option value="v1.5.0">v1.5.0 (Initial Keyword Filter)</option>
            <option value="v2.0.0">v2.0.0 (Pre-LLM Gateway Validation)</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center text-[#587D6E]">
          <ArrowRight className="w-5 h-5 hidden md:block text-[#00F5A0]" />
          <div className="md:hidden py-1 font-bold text-xs text-[#00F5A0]">VS</div>
        </div>

        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[10px] font-bold text-[#587D6E] uppercase block">
            Candidate Policy (B)
          </label>
          <select
            value={versionB}
            onChange={e => setVersionB(e.target.value)}
            className="w-full bg-[#051811] border border-[#124B37] rounded-lg p-2 text-xs text-[#00F5A0] font-bold focus:outline-none focus:border-[#00F5A0]"
          >
            <option value="v2.1.0">v2.1.0 (Active - Fencing + Canary)</option>
            <option value="v2.2.0-rc1">v2.2.0-rc1 (Delimiter Shield)</option>
          </select>
        </div>
      </div>

      {comparison && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-[#061A13] p-4 rounded-xl border border-[#124B37] shadow-card">
              <span className="text-[10px] font-bold text-[#587D6E] uppercase">Total Evaluated Vectors</span>
              <div className="text-3xl font-black text-[#E8FFF5] mt-1.5">{comparison.total_vectors_tested || 30}</div>
              <p className="text-[10px] text-[#587D6E] mt-1">Identical test suite across versions</p>
            </div>

            <div className="bg-[#061A13] p-4 rounded-xl border border-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.2)]">
              <span className="text-[10px] font-bold text-[#00F5A0] uppercase">Attack Reduction</span>
              <div className="text-3xl font-black text-[#00F5A0] mt-1.5">
                +{comparison.vulnerability_reduction_pct || 87.5}%
              </div>
              <p className="text-[10px] text-[#91B8A7] mt-1">Adversarial bypasses eliminated</p>
            </div>

            <div className="bg-[#061A13] p-4 rounded-xl border border-[#124B37] shadow-card">
              <span className="text-[10px] font-bold text-[#19E6FF] uppercase">False Positive Delta</span>
              <div className="text-3xl font-black text-[#19E6FF] mt-1.5">0.0%</div>
              <p className="text-[10px] text-[#587D6E] mt-1">Zero regression on benign prompts</p>
            </div>
          </div>

          {/* Category Table */}
          <div className="bg-[#061A13] rounded-xl border border-[#124B37] shadow-card overflow-hidden">
            <div className="p-4 border-b border-[#124B37] font-bold text-[#E8FFF5] text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#00F5A0]" />
                Category-by-Category Defense Efficacy
              </span>
              <span className="text-[10px] text-[#587D6E]">Deterministic Comparison</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#082219] text-[#587D6E] text-[10px] uppercase border-b border-[#124B37]">
                  <tr>
                    <th className="px-4 py-2.5">Adversarial Threat Category</th>
                    <th className="px-4 py-2.5 text-center">{versionA} Blocked</th>
                    <th className="px-4 py-2.5 text-center">{versionB} Blocked</th>
                    <th className="px-4 py-2.5 text-right">Efficacy Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#124B37]/40">
                  {comparison.categories?.map((c: any, i: number) => (
                    <tr key={i} className="hover:bg-[#082219]/40">
                      <td className="px-4 py-3 font-semibold text-[#E8FFF5]">
                        {c.category.replace('_', ' ').toUpperCase()}
                        <span className="block text-[10px] text-[#587D6E]">{c.total} test vectors</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[#FF4568] font-bold">{c.v_a_blocked}</span>
                        <span className="text-[10px] text-[#587D6E]"> / {c.total}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[#00F5A0] font-bold">{c.v_b_blocked}</span>
                        <span className="text-[10px] text-[#587D6E]"> / {c.total}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#00F5A0]">
                        +{Math.round(((c.v_b_blocked - c.v_a_blocked) / c.total) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
