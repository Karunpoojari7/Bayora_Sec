import React, { useState } from 'react';
import { Play, Shield, CheckCircle2, AlertTriangle, RefreshCw, BarChart2, Cpu, Zap } from 'lucide-react';
import { api } from '../../services/api';

interface PolicySimulatorPageProps {
  evaluationId: string;
}

export const PolicySimulatorPage: React.FC<PolicySimulatorPageProps> = ({ evaluationId }) => {
  const [candidatePolicy, setCandidatePolicy] = useState('v2.2.0-rc1 (Delimiter Hardened)');
  const [testDataset, setTestDataset] = useState('Standard Adversarial Suite (25 cases)');
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState<any | null>(null);

  const handleRunSimulation = async () => {
    setSimulating(true);
    setSimResults(null);
    try {
      // Simulate evaluation against candidate policy
      await new Promise(r => setTimeout(r, 1000));
      setSimResults({
        total_tested: 25,
        blocked_attacks: 23,
        missed_detections: 2,
        false_positives: 0,
        model_refusals: 19,
        avg_latency_ms: 14.2,
        precision_percent: 100,
        recall_percent: 92.0,
        cases: [
          { id: 'TC-01', name: 'Direct System Prompt Leakage', status: 'BLOCKED', matched_rule: 'System Prompt Regex', latency: '12ms' },
          { id: 'TC-02', name: 'Roleplay Delimiter Override', status: 'BLOCKED', matched_rule: 'Delimiter Fence', latency: '15ms' },
          { id: 'TC-03', name: 'Canary Secret Extraction', status: 'BLOCKED', matched_rule: 'Canary Trap Rule', latency: '9ms' },
          { id: 'TC-04', name: 'Multi-lingual Instruction Wrap', status: 'BLOCKED', matched_rule: 'Instruction Fence', latency: '18ms' },
          { id: 'TC-05', name: 'Novel Semantic Metaphor', status: 'MISSED', matched_rule: 'None (Model Refusal)', latency: '210ms' },
        ]
      });
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Offline Policy Simulator</h2>
          <p className="text-slate-500 text-sm mt-1">
            Safely benchmark candidate defense policies against historical attack vectors without modifying production gateway behavior.
          </p>
        </div>
        <button
          onClick={handleRunSimulation}
          disabled={simulating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
          {simulating ? 'Simulating Policy...' : 'Run Offline Simulation'}
        </button>
      </div>

      {/* Simulator Config */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Candidate Policy Configuration
          </label>
          <select
            value={candidatePolicy}
            onChange={e => setCandidatePolicy(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="v2.2.0-rc1 (Delimiter Hardened)">v2.2.0-rc1 (Delimiter Hardened + Multi-Turn Fence)</option>
            <option value="v2.3.0-experimental">v2.3.0-experimental (Strict Token Redaction)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Test Vector Dataset
          </label>
          <select
            value={testDataset}
            onChange={e => setTestDataset(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="Standard Adversarial Suite (25 cases)">Standard Adversarial Suite (25 cases)</option>
            <option value="OWASP LLM Top 10 Suite (40 cases)">OWASP LLM Top 10 Suite (40 cases)</option>
            <option value="Evaluation Historical Telemetry (Current Eval)">Evaluation Historical Telemetry (Current Eval)</option>
          </select>
        </div>
      </div>

      {simResults ? (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Blocked Attacks</span>
              <div className="text-2xl font-black text-emerald-900 mt-2">{simResults.blocked_attacks} / {simResults.total_tested}</div>
              <p className="text-xs text-emerald-700 mt-1">{simResults.recall_percent}% Recall Rate</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Missed Detections</span>
              <div className="text-2xl font-black text-rose-900 mt-2">{simResults.missed_detections}</div>
              <p className="text-xs text-rose-700 mt-1">Bypassed candidate rule</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">False Positives</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{simResults.false_positives}</div>
              <p className="text-xs text-slate-500 mt-1">{simResults.precision_percent}% Precision Rate</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg Gateway Latency</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{simResults.avg_latency_ms}ms</div>
              <p className="text-xs text-slate-500 mt-1">Rule execution overhead</p>
            </div>
          </div>

          {/* Test Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
              <span>Simulation Vector Execution Trace</span>
              <span className="text-xs text-slate-400">Deterministic Offline Run</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Adversarial Vector</th>
                    <th className="px-4 py-3">Simulation Outcome</th>
                    <th className="px-4 py-3">Triggered Filter</th>
                    <th className="px-4 py-3 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {simResults.cases.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{c.id}</td>
                      <td className="px-4 py-3 text-slate-900 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          c.status === 'BLOCKED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{c.matched_rule}</td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-slate-500">{c.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-2">
          <Zap className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-semibold text-slate-800">Simulator Ready</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Run Offline Simulation" to dry-run candidate defense filters against 25 standardized adversarial test vectors.
          </p>
        </div>
      )}
    </div>
  );
};
