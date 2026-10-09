import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, BarChart3, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResourceFairness } from '../types';
import { api } from '../services/api';

interface ResourceGovernorPageProps {
  evaluationId: string;
}

export const ResourceGovernorPage: React.FC<ResourceGovernorPageProps> = ({ evaluationId }) => {
  const [fairness, setFairness] = useState<ResourceFairness | null>(null);

  useEffect(() => {
    loadFairness();
  }, [evaluationId]);

  const loadFairness = async () => {
    try {
      const data = await api.getResourceFairness(evaluationId);
      setFairness(data);
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold font-mono text-white">RESOURCE GOVERNOR & FAIRNESS MONITOR</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
            RATE & QUOTA GOVERNANCE
          </span>
        </div>
        <p className="text-xs text-bayora-textMuted mt-0.5">
          Prevents adversarial resource exhaustion, tracks fairness metrics, and throttles noisy sandbox actors.
        </p>
      </div>

      {/* Fairness Indicator Hero Card */}
      <div className="p-6 rounded-2xl bg-bayora-card border border-bayora-border grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-bayora-textMuted uppercase">
            RESOURCE FAIRNESS INDICATOR
          </span>
          <div className="text-4xl font-mono font-black text-white">
            {fairness?.fairness_score ?? 98.0}
            <span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold">
            STATUS: {fairness?.status ?? 'BALANCED'}
          </div>
        </div>

        {/* Actor Share Distribution */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-mono text-slate-400">ACTOR RESOURCE ALLOCATION SHARE</span>
          
          <div className="space-y-2 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-rose-400">RED SANDBOX</span>
                <span className="text-slate-300">{fairness?.red_resource_share_pct ?? 33.3}%</span>
              </div>
              <div className="h-2 w-full bg-bayora-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${fairness?.red_resource_share_pct ?? 33.3}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyan-400">TARGET LLM</span>
                <span className="text-slate-300">{fairness?.llm_resource_share_pct ?? 33.4}%</span>
              </div>
              <div className="h-2 w-full bg-bayora-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${fairness?.llm_resource_share_pct ?? 33.4}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-400">BLUE SANDBOX</span>
                <span className="text-slate-300">{fairness?.blue_resource_share_pct ?? 33.3}%</span>
              </div>
              <div className="h-2 w-full bg-bayora-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${fairness?.blue_resource_share_pct ?? 33.3}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governor Recommendations */}
      <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>GOVERNOR OBSERVABILITY & INSIGHTS</span>
        </h3>
        <div className="space-y-2 font-mono text-xs text-slate-300">
          {fairness?.recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
