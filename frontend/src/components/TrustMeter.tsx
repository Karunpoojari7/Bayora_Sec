import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Award } from 'lucide-react';
import { TrustScoreBreakdown } from '../types';

interface TrustMeterProps {
  score: number;
  tier: string;
  breakdown?: TrustScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustMeter: React.FC<TrustMeterProps> = ({ score, tier, breakdown, size = 'md' }) => {
  let colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  let barColor = 'bg-emerald-500';
  let Icon = ShieldCheck;

  if (score < 60) {
    colorClass = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    barColor = 'bg-rose-500';
    Icon = ShieldAlert;
  } else if (score < 80) {
    colorClass = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    barColor = 'bg-amber-500';
    Icon = AlertTriangle;
  }

  return (
    <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-bayora-textMuted">
            BAYORA TRUST METRIC
          </span>
          <h3 className="text-sm font-semibold text-white">TEST INTEGRITY SCORE</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${colorClass}`}>
          {tier}
        </span>
      </div>

      <div className="flex items-center gap-6 my-3">
        {/* Large Score Display */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-mono font-extrabold text-white">{score}</span>
          <span className="text-sm font-mono text-bayora-textMuted">/100</span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="flex-1">
          <div className="h-3 w-full bg-bayora-bg rounded-full overflow-hidden border border-bayora-border">
            <div
              className={`h-full ${barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>0 (HIGH RISK)</span>
            <span>60 (REVIEW)</span>
            <span>80 (TRUSTED)</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Breakdown Dimensions */}
      {breakdown && (
        <div className="mt-4 pt-4 border-t border-bayora-border grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">ISOLATION (25%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.isolation_score}%</div>
          </div>
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">EVIDENCE (20%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.evidence_score}%</div>
          </div>
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">CONTAMINATION (20%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.contamination_score}%</div>
          </div>
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">FAIRNESS (15%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.fairness_score}%</div>
          </div>
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">ACCESS RBAC (10%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.access_score}%</div>
          </div>
          <div className="p-2 rounded-lg bg-bayora-bg/60 border border-bayora-border/60">
            <div className="text-[10px] font-mono text-bayora-textMuted">AUDIT (10%)</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">{breakdown.observability_score}%</div>
          </div>
        </div>
      )}
    </div>
  );
};
