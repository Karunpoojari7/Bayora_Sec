import React from 'react';
import {
  LayoutDashboard, FolderKanban, Swords, ShieldAlert,
  Cpu, FileCheck2, Bug, Gauge, Award, Settings as SettingsIcon,
  ShieldCheck, ArrowRightLeft, Lock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  threatCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, threatCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'evaluations', label: 'Evaluations', icon: FolderKanban },
    { id: 'red_team', label: 'Red Team Workspace', icon: Swords, badge: threatCount > 0 ? threatCount : undefined },
    { id: 'blue_team', label: 'Blue Team Workspace', icon: ShieldAlert },
    { id: 'target_llm', label: 'Target LLM Sandbox', icon: Cpu },
    { id: 'evidence', label: 'Evidence & Provenance', icon: FileCheck2 },
    { id: 'contamination', label: 'Contamination Center', icon: Bug },
    { id: 'fairness', label: 'Resource Fairness', icon: Gauge },
    { id: 'passport', label: 'Trust Passport', icon: Award, highlight: true },
    { id: 'settings', label: 'Settings & RBAC', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-bayora-card border-r border-bayora-border flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-bayora-textMuted px-3">
            EVALUATION CONSOLE
          </span>
          <nav className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 font-semibold'
                        : 'bg-bayora-accent/15 text-blue-400 border border-bayora-accent/30 font-semibold'
                      : item.highlight
                      ? 'text-cyan-400 hover:bg-bayora-cardHover border border-cyan-500/20'
                      : 'text-bayora-textMuted hover:text-white hover:bg-bayora-cardHover'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-bayora-textMuted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      FLAGSHIP
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security Assurance Box */}
        <div className="p-3.5 rounded-xl bg-bayora-bg/80 border border-bayora-border text-xs space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>ZERO-TRUST ENFORCED</span>
          </div>
          <p className="text-[11px] text-bayora-textMuted leading-relaxed">
            Red and Blue actors run in strictly isolated Docker networks. Raw attack payloads are stored in confidential tables.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-bayora-border">
            <span>SEPARATION</span>
            <span className="text-emerald-400 font-bold">100% HARDENED</span>
          </div>
        </div>
      </div>

      {/* Version Tag */}
      <div className="pt-4 border-t border-bayora-border text-center">
        <p className="text-[10px] font-mono text-bayora-textMuted">
          Bayora Control Plane v1.0.0-rc1
        </p>
        <p className="text-[9px] font-mono text-slate-500 mt-0.5">
          Hack in Hills '26 — Problem 04
        </p>
      </div>
    </aside>
  );
};
