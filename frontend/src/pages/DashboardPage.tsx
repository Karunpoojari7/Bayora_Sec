import React from 'react';
import {
  Shield, Swords, ShieldAlert, Cpu, Award,
  CheckCircle2, AlertTriangle, ArrowRight, Play, RefreshCw, Lock
} from 'lucide-react';
import { Evaluation, TestIntegrityPassport, Attack, SecurityFinding, BlueViewData } from '../types';
import { TrustMeter } from '../components/TrustMeter';
import { LiveFlowVisualizer } from '../components/LiveFlowVisualizer';

interface DashboardPageProps {
  evaluation: Evaluation | null;
  passport: TestIntegrityPassport | null;
  blueView: BlueViewData | null;
  onNavigate: (tab: string) => void;
  onStartEval: () => void;
  isLoading: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  evaluation,
  passport,
  blueView,
  onNavigate,
  onStartEval,
  isLoading,
}) => {
  if (!evaluation) {
    return (
      <div className="p-8 text-center text-bayora-textMuted font-mono">
        Loading evaluation telemetry...
      </div>
    );
  }

  const threatsCount = blueView?.threats_detected ?? 0;
  const attacksCount = blueView?.total_attacks ?? 0;
  const defensesCount = blueView?.defenses_active ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner: Active Evaluation State */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-bayora-card via-[#0D162B] to-[#0A1020] border border-bayora-border relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                ACTIVE EVALUATION
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                ● STATUS: {evaluation.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 font-mono">
              {evaluation.id} — {evaluation.project_name}
            </h2>
            <p className="text-xs text-bayora-textMuted mt-1">
              Target: <span className="text-cyan-400 font-mono font-semibold">{evaluation.target_model}</span> (v{evaluation.model_version}) | Profile: <span className="text-rose-400 font-mono">{evaluation.risk_profile}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('passport')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>VIEW PASSPORT</span>
            </button>
            <button
              onClick={() => onNavigate('red_team')}
              className="px-4 py-2 rounded-xl bg-bayora-bg hover:bg-bayora-cardHover border border-bayora-border text-white text-xs font-mono transition-all flex items-center gap-2"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>LAUNCH TEST</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Trust Score */}
        <div className="p-4 rounded-xl bg-bayora-card border border-bayora-border">
          <div className="flex items-center justify-between text-bayora-textMuted text-xs">
            <span className="font-mono">TRUST SCORE</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2">
            {passport?.trust_score ?? 100}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">
            {passport?.trust_tier ?? 'HIGH CONFIDENCE'}
          </div>
        </div>

        {/* KPI 2: Adversarial Attacks */}
        <div className="p-4 rounded-xl bg-bayora-card border border-bayora-border">
          <div className="flex items-center justify-between text-bayora-textMuted text-xs">
            <span className="font-mono">ATTACKS TESTED</span>
            <Swords className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2">
            {attacksCount}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            {threatsCount} Intercepted / Mitigated
          </div>
        </div>

        {/* KPI 3: Active Guardrails */}
        <div className="p-4 rounded-xl bg-bayora-card border border-bayora-border">
          <div className="flex items-center justify-between text-bayora-textMuted text-xs">
            <span className="font-mono">ACTIVE DEFENSES</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2">
            {defensesCount}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">
            Zero-Trust Gateway Rules
          </div>
        </div>

        {/* KPI 4: Provenance Events */}
        <div className="p-4 rounded-xl bg-bayora-card border border-bayora-border">
          <div className="flex items-center justify-between text-bayora-textMuted text-xs">
            <span className="font-mono">EVIDENCE CHAIN</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-2">
            VALID
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            SHA-256 Hash Chained
          </div>
        </div>
      </div>

      {/* Live Flow Visualizer Component */}
      <LiveFlowVisualizer
        activeDefensesCount={defensesCount}
        modelProvider={evaluation.target_model}
      />

      {/* Lower Dual Grid: Trust Score Meter & Recent Security Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Trust Score Meter */}
        {passport && (
          <TrustMeter
            score={passport.trust_score}
            tier={passport.trust_tier}
            breakdown={passport.score_breakdown}
          />
        )}

        {/* Right: Security Findings Feed */}
        <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">SECURITY FINDINGS</h3>
            <button
              onClick={() => onNavigate('blue_team')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {(!blueView?.findings || blueView.findings.length === 0) ? (
              <div className="p-6 text-center text-xs font-mono text-bayora-textMuted bg-bayora-bg rounded-xl border border-bayora-border">
                No active vulnerabilities detected. Target model safety within envelope.
              </div>
            ) : (
              blueView.findings.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{f.title}</div>
                    <div className="text-[11px] text-bayora-textMuted">{f.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    f.status === 'MITIGATED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {f.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
