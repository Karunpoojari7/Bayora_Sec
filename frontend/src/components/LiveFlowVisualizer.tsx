import React from 'react';
import { Swords, ShieldAlert, Cpu, Lock, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LiveFlowVisualizerProps {
  lastAttack?: any;
  activeDefensesCount: number;
  modelProvider: string;
  isExecuting?: boolean;
}

export const LiveFlowVisualizer: React.FC<LiveFlowVisualizerProps> = ({
  lastAttack,
  activeDefensesCount,
  modelProvider,
  isExecuting = false,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>LIVE ZERO-TRUST TEST FLOW</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NETWORK BOUNDARY ENFORCED
            </span>
          </h3>
          <p className="text-xs text-bayora-textMuted mt-0.5">
            Strict isolation: Sandboxes cannot communicate directly. All traffic is brokered by the Gateway.
          </p>
        </div>
        <div className="text-xs font-mono text-bayora-textMuted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>REAL-TIME TELEMETRY</span>
        </div>
      </div>

      {/* The 4-Node Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative py-2">
        {/* Node 1: Red Team Sandbox */}
        <div className="p-4 rounded-xl bg-bayora-bg/90 border border-rose-500/30 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
              <Swords className="w-4 h-4" />
              <span>RED SANDBOX</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
              red_net
            </span>
          </div>
          <p className="text-[11px] text-bayora-textMuted mt-2">
            Adversarial prompt generator. Raw payloads stored in confidential vault.
          </p>
          <div className="mt-3 pt-2 border-t border-rose-500/20 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Direct Access:</span>
            <span className="text-rose-400 font-bold">DENIED ✕</span>
          </div>
        </div>

        {/* Node 2: Policy Decision Point / Gateway */}
        <div className="p-4 rounded-xl bg-bayora-bg/90 border border-bayora-accent/40 relative group shadow-lg shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>POLICY GATEWAY</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              control_net
            </span>
          </div>
          <p className="text-[11px] text-bayora-textMuted mt-2">
            Zero-Trust PEP/PDP. Active defense evaluation & SHA-256 evidence logging.
          </p>
          <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Active Defenses:</span>
            <span className="text-cyan-400 font-bold">{activeDefensesCount} Rules</span>
          </div>
        </div>

        {/* Node 3: Target LLM Runtime */}
        <div className="p-4 rounded-xl bg-bayora-bg/90 border border-cyan-500/30 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <Cpu className="w-4 h-4" />
              <span>TARGET LLM</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              llm_net
            </span>
          </div>
          <p className="text-[11px] text-bayora-textMuted mt-2">
            Isolated execution environment with canary context tracking & session reset.
          </p>
          <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Runtime:</span>
            <span className="text-cyan-300 font-bold uppercase">{modelProvider}</span>
          </div>
        </div>

        {/* Node 4: Blue Team Defense */}
        <div className="p-4 rounded-xl bg-bayora-bg/90 border border-emerald-500/30 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>BLUE SANDBOX</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              blue_net
            </span>
          </div>
          <p className="text-[11px] text-bayora-textMuted mt-2">
            Sanitized telemetry consumer. Rule builder with confidential payload redaction.
          </p>
          <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Payload Visibility:</span>
            <span className="text-emerald-400 font-bold">SANITIZED ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
