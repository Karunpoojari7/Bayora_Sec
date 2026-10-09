import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Cpu, Database, UserCheck, ChevronDown, Lock } from 'lucide-react';
import { Role, Evaluation } from '../types';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
  chainValid: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  evaluations,
  selectedEvalId,
  onSelectEval,
  chainValid,
}) => {
  return (
    <header className="h-16 bg-bayora-card/95 backdrop-blur border-b border-bayora-border flex items-center justify-between px-6 z-30 sticky top-0">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bayora-accent to-bayora-cyan flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg tracking-wider text-white">BAYORA</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
              ZERO-TRUST EVALUATION
            </span>
          </div>
          <p className="text-xs text-bayora-textMuted">Trust the Test — AI Safety Infrastructure</p>
        </div>
      </div>

      {/* Central Active Evaluation Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-bayora-textMuted font-mono">TARGET EVALUATION:</span>
        <div className="relative">
          <select
            value={selectedEvalId}
            onChange={(e) => onSelectEval(e.target.value)}
            className="bg-bayora-bg border border-bayora-border hover:border-bayora-accent text-xs font-mono text-white rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-bayora-accent appearance-none cursor-pointer"
          >
            {evaluations.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} — {ev.project_name} ({ev.target_model})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-bayora-textMuted absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Right Controls: Zero-Trust Security Status & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* System Boundary Status */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bayora-bg border border-bayora-border text-xs font-mono text-bayora-textMuted">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>NETWORKS: <span className="text-emerald-400">ISOLATED</span></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bayora-bg border border-bayora-border text-xs font-mono text-bayora-textMuted">
            {chainValid ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>HASH CHAIN: <span className="text-emerald-400">VALID</span></span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>HASH CHAIN: <span className="text-rose-400 font-bold">TAMPERED</span></span>
              </>
            )}
          </div>
        </div>

        {/* RBAC Role Switcher */}
        <div className="flex items-center gap-2 bg-bayora-bg p-1 rounded-lg border border-bayora-border">
          <UserCheck className="w-4 h-4 text-bayora-textMuted ml-1.5" />
          <span className="text-xs font-mono text-bayora-textMuted hidden sm:inline">ACTOR:</span>
          {(['ADMIN', 'RED_TEAM', 'BLUE_TEAM', 'VIEWER'] as Role[]).map((r) => {
            const isActive = currentRole === r;
            let activeClass = 'bg-bayora-accent text-white shadow-sm';
            if (r === 'RED_TEAM') activeClass = 'bg-rose-600 text-white shadow-sm';
            if (r === 'BLUE_TEAM') activeClass = 'bg-blue-600 text-white shadow-sm';
            if (r === 'VIEWER') activeClass = 'bg-slate-700 text-slate-200';

            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`text-[11px] font-mono px-2 py-1 rounded transition-all ${
                  isActive ? activeClass : 'text-bayora-textMuted hover:text-white hover:bg-bayora-card'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
