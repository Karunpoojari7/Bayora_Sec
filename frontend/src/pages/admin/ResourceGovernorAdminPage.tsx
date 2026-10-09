import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, BarChart3, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ResourceFairness } from '../../types';
import { api } from '../../services/api';

interface ResourceGovernorAdminPageProps {
  evaluationId: string;
}

export const ResourceGovernorAdminPage: React.FC<ResourceGovernorAdminPageProps> = ({ evaluationId }) => {
  const [fairness, setFairness] = useState<ResourceFairness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (evaluationId) {
      loadFairness();
    }
  }, [evaluationId]);

  const loadFairness = async () => {
    setLoading(true);
    try {
      const data = await api.getResourceFairness(evaluationId);
      setFairness(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Governor & Fair Queuing</h2>
          <p className="text-slate-500 text-sm mt-1">
            Token quotas, fair-share scheduling, denial-of-service throttling, and rate limit enforcement.
          </p>
        </div>
        <button
          onClick={loadFairness}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Governor State
        </button>
      </div>

      {/* Fairness Hero */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fairness Allocation Index
          </span>
          <div className="text-4xl font-black text-slate-900">
            {fairness?.fairness_score ?? 98.0}
            <span className="text-sm font-normal text-slate-500"> / 100</span>
          </div>
          <div className="text-xs font-semibold text-emerald-700">
            Fair-share status: {fairness?.status ?? 'BALANCED'}
          </div>
        </div>

        {/* Shares */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quota Allocation Shares</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-rose-600 font-bold">Red Team Offensive Probes</span>
              <span>{fairness?.red_resource_share_pct ?? 42}% (Max: 50%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fairness?.red_resource_share_pct ?? 42}%` }}></div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-emerald-600 font-bold">Blue Team Policy Verifications</span>
              <span>{fairness?.blue_resource_share_pct ?? 38}% (Max: 50%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fairness?.blue_resource_share_pct ?? 38}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Global Rate Limit</div>
          <div className="text-xl font-bold text-slate-900 font-mono">60 req / min</div>
          <p className="text-xs text-slate-500">Sliding window bucket enforcement per actor identity.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concurrent Queue Depth</div>
          <div className="text-xl font-bold text-slate-900 font-mono">16 Max Concurrent</div>
          <p className="text-xs text-slate-500">Protects target LLM inference worker from memory exhaustion.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hard Quota Threshold</div>
          <div className="text-xl font-bold text-slate-900 font-mono">500 Probes / Eval</div>
          <p className="text-xs text-slate-500">Evaluation automatically suspends upon hitting probe ceiling.</p>
        </div>
      </div>
    </div>
  );
};
