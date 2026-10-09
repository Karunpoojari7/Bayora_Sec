import React from 'react';
import { Settings as SettingsIcon, Shield, Lock, Key, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Role } from '../types';

interface SettingsPageProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold font-mono text-white">SETTINGS & ZERO-TRUST RBAC</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
            SECURITY GOVERNANCE
          </span>
        </div>
        <p className="text-xs text-bayora-textMuted mt-0.5">
          Manage capability-based access controls, inspect container hardening, and review demo credentials.
        </p>
      </div>

      {/* Role Switcher Panel */}
      <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>SIMULATED ACTOR / ROLE SWITCHER</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {[
            {
              role: 'ADMIN',
              desc: 'Full control plane authority, tamper simulation, and disclosure control.',
              caps: ['admin:all', 'red:*', 'blue:*', 'evidence:*'],
            },
            {
              role: 'RED_TEAM',
              desc: 'Execute adversarial vectors, access confidential payload storage.',
              caps: ['red:submit_attack', 'red:read_payload', 'evaluation:control'],
            },
            {
              role: 'BLUE_TEAM',
              desc: 'View sanitized telemetry, build and test defense rules. Red payloads strictly redacted.',
              caps: ['blue:read_sanitized_results', 'blue:write_defense', 'blue:test_defense'],
            },
            {
              role: 'VIEWER',
              desc: 'Auditor access to sanitized reports, evidence chains, and passports.',
              caps: ['evidence:read', 'trust:read'],
            },
          ].map((item) => (
            <div
              key={item.role}
              onClick={() => onRoleChange(item.role as Role)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                currentRole === item.role
                  ? 'bg-bayora-accent/15 border-bayora-accent shadow-lg shadow-blue-500/10'
                  : 'bg-bayora-bg border-bayora-border hover:border-bayora-borderHighlight'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.role}</span>
                {currentRole === item.role && (
                  <span className="text-[10px] font-bold text-emerald-400">ACTIVE ✓</span>
                )}
              </div>
              <p className="text-[11px] text-bayora-textMuted leading-relaxed">{item.desc}</p>
              <div className="pt-2 border-t border-bayora-border/60 text-[10px] text-slate-400 space-y-0.5">
                <span className="text-slate-500 block">Capabilities:</span>
                {item.caps.map((c) => (
                  <span key={c} className="inline-block mr-1 text-cyan-300">
                    `{c}`
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Container Security Hardening Profile */}
      <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>DOCKER HARDENING & ISOLATION SPECIFICATION</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">PRIVILEGE ESCALATION:</span>
            <span className="text-emerald-400 font-bold">no-new-privileges:true</span>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">LINUX CAPABILITIES:</span>
            <span className="text-emerald-400 font-bold">cap_drop: [ALL]</span>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">ROOT FILESYSTEM:</span>
            <span className="text-emerald-400 font-bold">read_only: true</span>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">CONTAINER USER:</span>
            <span className="text-emerald-400 font-bold">USER 10001 (Non-Root)</span>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">NETWORK ISOLATION:</span>
            <span className="text-emerald-400 font-bold">Internal Bridge Networks</span>
          </div>

          <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border flex items-center justify-between">
            <span className="text-slate-300">HOST DOCKER SOCKET:</span>
            <span className="text-emerald-400 font-bold">UNMOUNTED (Protected)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
