import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Key, FolderKanban, Server,
  FileText, ShieldCheck, Gauge, Award, LogOut, ChevronDown, Shield, Lock
} from 'lucide-react';
import { UserProfile, Evaluation } from '../types';

interface AdminLayoutProps {
  currentUser: UserProfile;
  onLogout: () => void;
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  evaluations,
  selectedEvalId,
  onSelectEval,
}) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/overview', label: 'Platform Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users & Teams', icon: Users },
    { to: '/admin/rbac', label: 'Roles & Permissions', icon: Key },
    { to: '/admin/evaluations', label: 'Evaluations', icon: FolderKanban },
    { to: '/admin/infrastructure', label: 'Sandbox Topology', icon: Server },
    { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
    { to: '/admin/evidence', label: 'Evidence Verification', icon: ShieldCheck },
    { to: '/admin/governor', label: 'Resource Governance', icon: Gauge },
    { to: '/admin/passport', label: 'Trust Passport', icon: Award, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Admin Top Navbar */}
      <header className="h-16 bg-white border-b border-blue-100 flex items-center justify-between px-6 z-30 sticky top-0 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25 text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base tracking-wider text-slate-900">BAYORA</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                ADMIN CONTROL PLANE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Platform Governance, RBAC & Test Verification</p>
          </div>
        </div>

        {/* Evaluation Selector & Manage Platform CTA */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedEvalId}
              onChange={(e) => onSelectEval(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-mono font-medium text-slate-800 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {evaluations.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.id} — {ev.project_name} ({ev.target_model})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate('/admin/infrastructure')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>MANAGE PLATFORM SECURITY</span>
          </button>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 font-mono">{currentUser.username}</div>
            <div className="text-[10px] text-blue-700 font-bold font-mono">ADMINISTRATOR</div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] shadow-subtle flex-shrink-0">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3">
                GOVERNANCE WORKSPACE
              </span>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? item.highlight
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                              : 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Zero-Trust Admin Assurance */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold text-[11px]">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>ROOT OF TRUST</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Platform-wide Merkle evidence verification and container capability enforcement.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[10px] font-mono text-slate-500">
            Bayora Control Plane v1.0
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
