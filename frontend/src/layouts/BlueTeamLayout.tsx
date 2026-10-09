import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, ShieldCheck, Filter,
  Play, History, BarChart3, Crosshair, FileCheck,
  BookOpen, Activity, Shield, LogOut, ChevronDown,
  Bell, Lock
} from 'lucide-react';
import { UserProfile, Evaluation } from '../types';

interface BlueTeamLayoutProps {
  currentUser: UserProfile;
  onLogout: () => void;
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
}

export const BlueTeamLayout: React.FC<BlueTeamLayoutProps> = ({
  currentUser,
  onLogout,
  evaluations,
  selectedEvalId,
  onSelectEval,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/blue-team/overview', label: 'Defense Overview', icon: LayoutDashboard },
    { to: '/blue-team/alerts', label: 'Live Alerts', icon: ShieldAlert },
    { to: '/blue-team/policies', label: 'Defense Policies', icon: ShieldCheck },
    { to: '/blue-team/rules', label: 'Detection Rules', icon: Filter },
    { to: '/blue-team/simulator', label: 'Policy Simulator', icon: Play },
    { to: '/blue-team/deployments', label: 'Deployment History', icon: History },
    { to: '/blue-team/regression', label: 'Regression Results', icon: BarChart3 },
    { to: '/blue-team/threat-intel', label: 'Threat Intelligence', icon: Crosshair },
    { to: '/blue-team/evidence', label: 'Evidence Monitor', icon: FileCheck },
    { to: '/blue-team/playbooks', label: 'Response Playbooks', icon: BookOpen },
    { to: '/blue-team/health', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#020B08] text-[#E8FFF5] flex flex-col font-sans selection:bg-[#00F5A0] selection:text-[#020B08]">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#03100C] border-b border-[#124B37] flex items-center justify-between px-6 z-30 sticky top-0">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#061A13] border border-[#00F5A0] flex items-center justify-center shadow-[0_0_12px_rgba(0,245,160,0.4)] text-[#00F5A0]">
            <Shield className="w-5 h-5 fill-[#00F5A0]/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg tracking-wider text-[#E8FFF5]">BAYORA</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#082219] text-[#00F5A0] border border-[#124B37] font-bold">
                BLUE TEAM DEFENSE
              </span>
            </div>
            <p className="text-[11px] text-[#587D6E] hidden sm:block">Platform Governance, RBAC & Test Verification</p>
          </div>
        </div>

        {/* Evaluation Context Selector & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedEvalId}
              onChange={(e) => onSelectEval(e.target.value)}
              className="bg-[#051811] border border-[#124B37] hover:border-[#00F5A0] text-xs font-mono font-medium text-[#E8FFF5] rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#00F5A0] appearance-none cursor-pointer shadow-inner min-w-[280px] max-w-[420px] truncate"
            >
              {evaluations.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-[#051811] text-[#E8FFF5]">
                  {ev.id} — {ev.project_name} ({ev.target_model})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#00F5A0] absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate('/blue-team/policies')}
            className="px-3.5 py-2 rounded-lg bg-[#061A13] hover:bg-[#082219] border border-[#00F5A0] text-[#00F5A0] hover:text-[#E8FFF5] text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(0,245,160,0.25)] cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00F5A0]" />
            <span>DEFENSIVE OPERATIONS</span>
          </button>

          {/* Notification Icon */}
          <div className="relative p-2 rounded-lg bg-[#051811] border border-[#124B37] text-[#91B8A7] hover:text-white cursor-pointer transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4568] text-[9px] font-bold text-white flex items-center justify-center border border-[#03100C]">
              4
            </span>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#124B37]">
            <div className="w-8 h-8 rounded-full bg-[#00F5A0] text-[#020B08] font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(0,245,160,0.4)]">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-[#E8FFF5] font-mono leading-none">{currentUser.username}</div>
              <div className="text-[10px] text-[#00F5A0] font-bold font-mono mt-0.5">Blue Team</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-[#587D6E] hover:text-[#FF4568] hover:bg-[#1F0A10] rounded-lg border border-transparent hover:border-[#FF4568]/40 transition-all cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#03100C] border-r border-[#124B37] flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#587D6E] font-bold px-3">
                BLUE TEAM WORKSPACE
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
                            ? 'bg-gradient-to-r from-[#063321] to-[#0D4D36] text-[#FFFFFF] font-bold border border-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.35)]'
                            : 'text-[#91B8A7] hover:text-[#E8FFF5] hover:bg-[#082219] hover:border hover:border-[#124B37]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#00F5A0]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Defense Status Card */}
            <div className="p-3.5 rounded-xl bg-[#061A13] border border-[#124B37] text-xs space-y-1.5 font-mono shadow-card">
              <div className="text-[10px] uppercase text-[#587D6E] font-bold">DEFENSE STATUS</div>
              <div className="flex items-center gap-2 pt-0.5">
                <div className="w-7 h-7 rounded-lg bg-[#082219] border border-[#00F5A0]/40 flex items-center justify-center text-[#00F5A0]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[#E8FFF5] font-bold text-xs leading-none">Active & Enforcing</div>
                  <div className="text-[10px] text-[#00F5A0] mt-0.5">12 Policies · v2.1.0</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#124B37] text-[11px] font-mono space-y-1">
            <div className="text-[#587D6E]">Bayora Defense Studio v1.0</div>
            <div className="text-[#00F5A0] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse"></span>
              All Defenses Active
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#04130F] p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
