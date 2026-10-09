import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Flame, BookOpen, Swords, Clock,
  ShieldAlert, Database, FileText, Server, LogOut,
  ChevronDown, Bell, Shield, Lock, Radio
} from 'lucide-react';
import { UserProfile, Evaluation } from '../types';

interface RedTeamLayoutProps {
  currentUser: UserProfile;
  onLogout: () => void;
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
}

export const RedTeamLayout: React.FC<RedTeamLayoutProps> = ({
  currentUser,
  onLogout,
  evaluations,
  selectedEvalId,
  onSelectEval,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/red-team/dashboard', label: 'Attack Dashboard', icon: LayoutDashboard },
    { to: '/red-team/campaigns', label: 'Campaigns', icon: Flame },
    { to: '/red-team/library', label: 'Test Library', icon: BookOpen },
    { to: '/red-team/playground', label: 'Attack Playground', icon: Swords },
    { to: '/red-team/timeline', label: 'Execution Timeline', icon: Clock },
    { to: '/red-team/findings', label: 'Findings', icon: ShieldAlert },
    { to: '/red-team/vault', label: 'Payload Vault', icon: Database },
    { to: '/red-team/reports', label: 'Evaluation Reports', icon: FileText },
    { to: '/red-team/sandbox', label: 'Sandbox Status', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-[#F4F6FA] flex flex-col font-sans selection:bg-[#FF233F] selection:text-white">
      {/* Top Header Navbar */}
      <header className="h-16 bg-[#08090D] border-b border-[#39202A] flex items-center justify-between px-6 z-30 sticky top-0">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D1118] border border-[#FF233F] flex items-center justify-center shadow-[0_0_12px_rgba(255,35,63,0.4)] text-[#FF233F]">
            <Radio className="w-5 h-5 fill-[#FF233F]/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg tracking-wider text-[#F4F6FA]">BAYORA</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#131720] text-[#FF233F] border border-[#39202A] font-bold">
                RED TEAM OPERATIONS
              </span>
            </div>
            <p className="text-[11px] text-[#737D90] hidden sm:block">Adversarial AI Safety & Exploit Testing Lab</p>
          </div>
        </div>

        {/* Evaluation Context Selector & Launch Action */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedEvalId}
              onChange={(e) => onSelectEval(e.target.value)}
              className="bg-[#090B10] border border-[#39202A] hover:border-[#FF233F] text-xs font-mono font-medium text-[#F4F6FA] rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#FF233F] appearance-none cursor-pointer shadow-inner min-w-[280px] max-w-[420px] truncate"
            >
              {evaluations.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-[#090B10] text-[#F4F6FA]">
                  {ev.id} — {ev.project_name} ({ev.target_model})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#FF233F] absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate('/red-team/campaigns')}
            className="px-3.5 py-2 rounded-lg bg-[#0D1118] hover:bg-[#131720] border border-[#FF233F] text-[#FF233F] hover:text-[#F4F6FA] text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(255,35,63,0.25)] cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#FF233F]" />
            <span>LAUNCH CAMPAIGN</span>
          </button>

          {/* Notification Icon */}
          <div className="relative p-2 rounded-lg bg-[#090B10] border border-[#39202A] text-[#A1A8B7] hover:text-white cursor-pointer transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF233F] text-[9px] font-bold text-white flex items-center justify-center border border-[#08090D]">
              3
            </span>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#39202A]">
            <div className="w-8 h-8 rounded-full bg-[#FF233F] text-white font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(255,35,63,0.4)]">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-[#F4F6FA] font-mono leading-none">{currentUser.username}</div>
              <div className="text-[10px] text-[#FF233F] font-bold font-mono mt-0.5">Red Operator</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-[#737D90] hover:text-[#FF233F] hover:bg-[#1F0A10] rounded-lg border border-transparent hover:border-[#FF233F]/40 transition-all cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#08090D] border-r border-[#39202A] flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737D90] font-bold px-3">
                OFFENSIVE WORKSPACE
              </span>
              <nav className="mt-2.5 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#3D0A14] to-[#601222] text-[#FFFFFF] font-bold border border-[#FF233F] shadow-[0_0_15px_rgba(255,35,63,0.35)]'
                            : 'text-[#A1A8B7] hover:text-[#F4F6FA] hover:bg-[#131720] hover:border hover:border-[#39202A]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#FF233F]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Confidential Payload Vault Card */}
            <div className="p-3.5 rounded-xl bg-[#0D1118] border border-[#39202A] text-xs space-y-1.5 font-mono shadow-card">
              <div className="flex items-center gap-1.5 text-[#FF5268] font-bold text-[11px]">
                <Lock className="w-3.5 h-3.5 text-[#FF233F]" />
                <span>CONFIDENTIAL VAULT</span>
              </div>
              <p className="text-[10px] text-[#737D90] leading-relaxed">
                Raw exploit payloads vaulted. Blue Team telemetry is strictly sanitized by default.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#39202A] text-[11px] font-mono space-y-1">
            <div className="text-[#737D90]">Bayora Red Team Engine v1.0</div>
            <div className="text-[#22D3A6] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22D3A6] animate-pulse"></span>
              Sandbox Isolated (red_net)
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#050607] p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
