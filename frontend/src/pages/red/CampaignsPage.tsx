import React, { useState } from 'react';
import { Flame, Play, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw, BarChart2, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { Evaluation } from '../../types';

interface CampaignsPageProps {
  evaluationId: string;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ evaluationId }) => {
  const [campaignName, setCampaignName] = useState('Adversarial Safety Campaign 2026');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'prompt_injection',
    'system_prompt_extraction',
    'instruction_override',
    'data_exfiltration'
  ]);
  const [batchSize, setBatchSize] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [campaignResults, setCampaignResults] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, vulnerable: 0, allowed: 0 });

  const categories = [
    { id: 'prompt_injection', label: 'Prompt Injection / Jailbreak', desc: 'DAN, cognitive bypass, and heuristic overrides' },
    { id: 'system_prompt_extraction', label: 'System Prompt Extraction', desc: 'Direct instruction leak and delimiter confusion' },
    { id: 'instruction_override', label: 'Instruction Conflict / Overrides', desc: 'Role confusion and authority hijacking' },
    { id: 'data_exfiltration', label: 'Data Exfiltration & Tool Abuse', desc: 'Synthetic secret probing and unauthorized API calls' },
    { id: 'context_manipulation', label: 'Multi-Turn Context Manipulation', desc: 'Drifting semantic context across turns' }
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) return;
    setIsRunning(true);
    setCampaignResults([]);

    try {
      const library = await api.getAttackLibrary(evaluationId);
      const testCases = library.filter(item => selectedCategories.includes(item.category)).slice(0, batchSize);

      const results = [];
      let blockedCount = 0;
      let vulnCount = 0;
      let allowedCount = 0;

      for (const tc of testCases) {
        try {
          const res = await api.submitAttack(evaluationId, {
            prompt: tc.sample_prompt,
            category: tc.category,
            severity: tc.severity
          });
          results.push({ ...res, test_name: tc.name, category: tc.category });
          if (res.result_class === 'BLOCKED') blockedCount++;
          else if (res.result_class === 'VULNERABLE') vulnCount++;
          else allowedCount++;
        } catch (err: any) {
          results.push({ test_name: tc.name, status: 'FAILED', result_class: 'ERROR', response: err.message, latency_ms: 0 });
        }
      }

      setCampaignResults(results);
      setStats({
        total: results.length,
        blocked: blockedCount,
        vulnerable: vulnCount,
        allowed: allowedCount
      });
    } catch (e: any) {
      alert(`Campaign failed: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-slate-900">ATTACK CAMPAIGNS</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-bold">
              BATCH EVALUATOR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated attack vectors, execute multi-category batches, and measure defense bypass rates.
          </p>
        </div>
      </div>

      {/* Campaign Builder & Config */}
      <form onSubmit={handleLaunchCampaign} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-5">
        <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold border-b border-slate-100 pb-3">
          <Flame className="w-4 h-4 text-red-600" />
          <span>CAMPAIGN CONFIGURATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">CAMPAIGN TITLE</label>
            <input
              type="text"
              required
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">TEST BATCH SIZE</label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            >
              <option value={2}>2 Test Vectors (Quick Sanity)</option>
              <option value={4}>4 Test Vectors (Standard Batch)</option>
              <option value={8}>8 Test Vectors (Comprehensive Suite)</option>
            </select>
          </div>
        </div>

        {/* Categories Selection Matrix */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-700 block mb-2">
            TARGET ADVERSARIAL CATEGORIES
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-red-50/70 border-red-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-900">{cat.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-red-600 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isRunning || selectedCategories.length === 0}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'EXECUTING CAMPAIGN...' : 'LAUNCH ATTACK CAMPAIGN'}</span>
          </button>
        </div>
      </form>

      {/* Campaign Outcomes & Metrics */}
      {campaignResults.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">TOTAL EXECUTED</span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{stats.total}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">POLICY BLOCKED</span>
              <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">{stats.blocked}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">SUCCESSFUL BYPASSES</span>
              <div className="text-2xl font-mono font-bold text-red-700 mt-1">{stats.vulnerable}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">MITIGATION RATE</span>
              <div className="text-2xl font-mono font-bold text-blue-700 mt-1">
                {stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-mono">CAMPAIGN EXECUTION LOG</h3>
            <div className="space-y-2">
              {campaignResults.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.test_name || `Vector #${i + 1}`}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.result_class === 'BLOCKED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : r.result_class === 'VULNERABLE'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {r.result_class}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{r.response}</p>
                  <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                    <span>Category: {r.category}</span>
                    <span>Latency: {r.latency_ms}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
