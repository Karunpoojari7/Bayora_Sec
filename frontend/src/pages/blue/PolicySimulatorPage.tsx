import React, { useState } from 'react';
import {
  Play, Shield, CheckCircle2, AlertTriangle, RefreshCw,
  BarChart2, Cpu, Zap, Search, ArrowUpRight, TrendingUp,
  CheckCircle, Sliders, Check
} from 'lucide-react';

interface PolicySimulatorPageProps {
  evaluationId: string;
}

export const PolicySimulatorPage: React.FC<PolicySimulatorPageProps> = ({ evaluationId }) => {
  const [baselinePolicy, setBaselinePolicy] = useState('v2.0 (Current Production)');
  const [candidatePolicy, setCandidatePolicy] = useState('v2.6 (Edited)');
  const [testDataset, setTestDataset] = useState('Standard Adversarial Suite (25 cases)');
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'comparison' | 'metrics' | 'report'>('results');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const cases = [
    { id: 1, type: 'Prompt Injection', baseline: 'BLOCKED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 2, type: 'Jailbreak Attempt', baseline: 'ALLOWED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 3, type: 'Data Exfiltration', baseline: 'ALLOWED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 4, type: 'Role Confusion', baseline: 'BLOCKED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 5, type: 'Context Manipulation', baseline: 'CONFUSED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 6, type: 'System Prompt Leakage', baseline: 'ALLOWED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 7, type: 'Delimiter Override', baseline: 'ALLOWED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
    { id: 8, type: 'Canary Token Extraction', baseline: 'BLOCKED', candidate: 'BLOCKED', expected: 'BLOCKED', status: 'Pass' },
  ];

  const handleRunSimulation = async () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
    }, 800);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2.5">
            Policy Simulator & Regression Analysis
          </h1>
          <p className="text-xs text-[#91B8A7] mt-1">
            Test candidate policies against adversarial datasets and compare performance.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={simulating}
          className="px-4 py-2 rounded-lg bg-[#00F5A0] hover:bg-[#00C982] text-[#020B08] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,160,0.4)] cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
          {simulating ? 'Running Simulation...' : 'Run New Simulation'}
        </button>
      </div>

      {/* Simulation Configuration Bar */}
      <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card space-y-3">
        <div className="text-xs font-bold text-[#E8FFF5]">Simulation Configuration</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-[#587D6E] uppercase block mb-1">Baseline Policy</label>
            <select
              value={baselinePolicy}
              onChange={(e) => setBaselinePolicy(e.target.value)}
              className="w-full bg-[#051811] border border-[#124B37] text-[#E8FFF5] rounded-lg p-2 focus:outline-none focus:border-[#00F5A0]"
            >
              <option value="v2.0 (Current Production)">v2.0 (Current Production)</option>
              <option value="v1.5 (Baseline Keyword)">v1.5 (Baseline Keyword)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#587D6E] uppercase block mb-1">Candidate Policy</label>
            <select
              value={candidatePolicy}
              onChange={(e) => setCandidatePolicy(e.target.value)}
              className="w-full bg-[#051811] border border-[#124B37] text-[#00F5A0] font-bold rounded-lg p-2 focus:outline-none focus:border-[#00F5A0]"
            >
              <option value="v2.6 (Edited)">v2.6 (Edited - Regex Fencing)</option>
              <option value="v2.7 (Experimental)">v2.7 (Experimental)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#587D6E] uppercase block mb-1">Test Dataset</label>
            <select
              value={testDataset}
              onChange={(e) => setTestDataset(e.target.value)}
              className="w-full bg-[#051811] border border-[#124B37] text-[#E8FFF5] rounded-lg p-2 focus:outline-none focus:border-[#00F5A0]"
            >
              <option value="Standard Adversarial Suite (25 cases)">Standard Adversarial Suite (25 cases)</option>
              <option value="OWASP LLM Top 10 Suite (40 cases)">OWASP LLM Top 10 Suite (40 cases)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#124B37] pb-1 text-xs">
        <div className="flex items-center gap-1">
          {(['results', 'comparison', 'metrics', 'report'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-t-lg transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-[#061A13] text-[#00F5A0] border-t border-x border-[#124B37] font-bold'
                  : 'text-[#587D6E] hover:text-[#E8FFF5]'
              }`}
            >
              {tab === 'results' ? 'Simulation Results' : tab === 'comparison' ? 'Case Comparison' : tab === 'metrics' ? 'Metrics Analysis' : 'Regression Report'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#082219] border border-[#00F5A0] text-[#00F5A0] text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Simulation Complete
          </span>
          <span className="text-xs text-[#91B8A7]">25 / 25 cases</span>
        </div>
      </div>

      {/* Row 1: Overall Results (Donut Gauges) + Improvement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Overall Results (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#124B37] pb-2">
            <span className="text-xs font-bold text-[#E8FFF5]">Overall Results</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-[#FF4568]">● Blocked</span>
              <span className="text-[#00F5A0]">● Defended</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center text-center">
            {/* Baseline Donut */}
            <div className="p-3 rounded-xl bg-[#051811] border border-[#124B37]">
              <div className="text-[11px] text-[#587D6E] font-bold">Baseline (v2.0)</div>
              <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="36" stroke="#082219" strokeWidth="6" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="#FF4568"
                    strokeWidth="6"
                    strokeDasharray="226"
                    strokeDashoffset="54"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-lg font-black text-[#E8FFF5]">76.0%</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[#E8FFF5]">19 / 25 blocked</div>
              <div className="text-[10px] text-[#FF4568] mt-0.5">2 false positives</div>
            </div>

            {/* Candidate Donut */}
            <div className="p-3 rounded-xl bg-[#051811] border border-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.2)]">
              <div className="text-[11px] text-[#00F5A0] font-bold">Candidate (v2.6)</div>
              <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="36" stroke="#082219" strokeWidth="6" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="#00F5A0"
                    strokeWidth="6"
                    strokeDasharray="226"
                    strokeDashoffset="18"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-lg font-black text-[#00F5A0]">92.0%</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[#E8FFF5]">23 / 25 blocked</div>
              <div className="text-[10px] text-[#00F5A0] mt-0.5">0 false positives</div>
            </div>
          </div>
        </div>

        {/* Improvement Metrics (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2 mb-4">
              <span className="text-xs font-bold text-[#E8FFF5]">Improvement Metrics</span>
              <span className="text-[10px] text-[#00F5A0]">vs Baseline v2.0</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-[#051811] border border-[#124B37]">
                <div className="text-2xl font-black text-[#00F5A0]">+16.0%</div>
                <div className="text-[10px] text-[#91B8A7] mt-1">Block Rate Increase</div>
              </div>

              <div className="p-3 rounded-lg bg-[#051811] border border-[#124B37]">
                <div className="text-2xl font-black text-[#00F5A0]">-50.0%</div>
                <div className="text-[10px] text-[#91B8A7] mt-1">False Positive Reduction</div>
              </div>

              <div className="p-3 rounded-lg bg-[#051811] border border-[#124B37]">
                <div className="text-2xl font-black text-[#00F5A0]">0</div>
                <div className="text-[10px] text-[#91B8A7] mt-1">New Regressions</div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="p-3 rounded-xl bg-[#082219] border border-[#00F5A0] flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#00F5A0] shrink-0" />
            <p className="text-xs text-[#E8FFF5] leading-snug">
              Candidate policy showed significant improvement with no detected regressions. Safe for gateway deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Per-Case Results (7 cols) + Performance Comparison (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Per-Case Results Table (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#124B37] pb-2">
            <span className="text-xs font-bold text-[#E8FFF5]">Per-Case Results (25)</span>
            <div className="flex items-center gap-2">
              <select className="bg-[#051811] border border-[#124B37] text-[10px] text-[#E8FFF5] rounded px-2 py-1">
                <option>All Cases</option>
                <option>Failed Only</option>
                <option>Regressed Only</option>
              </select>
              <select className="bg-[#051811] border border-[#124B37] text-[10px] text-[#E8FFF5] rounded px-2 py-1">
                <option>All Categories</option>
                <option>Prompt Injection</option>
                <option>Jailbreak</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-[10px] text-[#587D6E] uppercase border-b border-[#124B37]">
                <tr>
                  <th className="pb-1.5">#</th>
                  <th className="pb-1.5">ATTACK TYPE</th>
                  <th className="pb-1.5">BASELINE</th>
                  <th className="pb-1.5">CANDIDATE</th>
                  <th className="pb-1.5">EXPECTED</th>
                  <th className="pb-1.5 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#124B37]/40">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#082219]/50">
                    <td className="py-2 text-[#587D6E]">{c.id}</td>
                    <td className="py-2 text-[#E8FFF5] font-semibold">{c.type}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        c.baseline === 'BLOCKED' ? 'bg-[#00F5A0]/15 text-[#00F5A0]' : 'bg-[#FF4568]/15 text-[#FF4568]'
                      }`}>
                        {c.baseline}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00F5A0]/15 text-[#00F5A0]">
                        {c.candidate}
                      </span>
                    </td>
                    <td className="py-2 text-[#91B8A7]">{c.expected}</td>
                    <td className="py-2 text-right">
                      <span className="text-[#00F5A0] font-bold flex items-center justify-end gap-1">
                        <Check className="w-3 h-3" /> {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Comparison (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2 mb-3">
              <span className="text-xs font-bold text-[#E8FFF5]">Performance Comparison</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-[#587D6E]">■ Baseline v2.0</span>
                <span className="text-[#00F5A0]">■ Candidate v2.6</span>
              </div>
            </div>

            {/* Custom Bar Comparison Visualization */}
            <div className="space-y-4 pt-2">
              {/* Metric 1: Block Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#91B8A7]">Block Rate</span>
                  <span className="text-[#00F5A0] font-bold">76% → 92%</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#587D6E] h-full rounded-full w-[76%]"></div>
                  </div>
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00F5A0] h-full rounded-full w-[92%] shadow-[0_0_8px_#00F5A0]"></div>
                  </div>
                </div>
              </div>

              {/* Metric 2: False Positives */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#91B8A7]">False Positives</span>
                  <span className="text-[#00F5A0] font-bold">16% → 8%</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF4568] h-full rounded-full w-[16%]"></div>
                  </div>
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00F5A0] h-full rounded-full w-[8%]"></div>
                  </div>
                </div>
              </div>

              {/* Metric 3: Response Time */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#91B8A7]">Response Overhead</span>
                  <span className="text-[#00F5A0] font-bold">129ms → 115ms</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#587D6E] h-full rounded-full w-[65%]"></div>
                  </div>
                  <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#19E6FF] h-full rounded-full w-[58%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#124B37] text-[11px] text-[#587D6E] text-center">
            Evaluated against 25 standardized adversarial probes
          </div>
        </div>
      </div>
    </div>
  );
};
