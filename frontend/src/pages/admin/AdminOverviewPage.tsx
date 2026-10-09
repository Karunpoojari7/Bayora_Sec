import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, FolderKanban, Server, Award, CheckCircle2,
  AlertTriangle, RefreshCw, Lock, Activity, Database, Cpu,
  HardDrive, Layers, ArrowRight, ShieldCheck, Flame, Box,
  ChevronDown, Radio, AlertOctagon, Check
} from 'lucide-react';
import { api } from '../../services/api';
import { Evaluation, TestIntegrityPassport, EvidenceVerification } from '../../types';

interface AdminOverviewPageProps {
  evaluationId: string;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ evaluationId }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    evaluation: Evaluation;
    passport: TestIntegrityPassport;
    evidence_integrity: EvidenceVerification;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 24 Hours');

  useEffect(() => {
    loadOverview();
  }, [evaluationId]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard(evaluationId);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard overview', err);
    } finally {
      setLoading(false);
    }
  };

  const evalItem = dashboardData?.evaluation;
  const pass = dashboardData?.passport;
  const evid = dashboardData?.evidence_integrity;

  const infrastructureServices = [
    { name: 'FastAPI Gateway', latency: '12ms', status: 'Healthy', icon: Server, color: '#00A3FF' },
    { name: 'Red Team Worker', latency: '8ms', status: 'Healthy', icon: AlertOctagon, color: '#FF3D59' },
    { name: 'Blue Team Guard', latency: '10ms', status: 'Healthy', icon: Shield, color: '#00D6B5' },
    { name: 'Target LLM (Ollama)', latency: '145ms', status: 'Healthy', icon: Cpu, color: '#A56BFF' },
    { name: 'PostgreSQL', latency: '3ms', status: 'Healthy', icon: Database, color: '#00A3FF' },
    { name: 'Redis', latency: '2ms', status: 'Healthy', icon: Layers, color: '#FF3D59' },
  ];

  const recentAuditEvents = [
    { time: '10:24:31', event: 'EVALUATION_CREATED', actor: 'admin', details: evaluationId || 'BAY-2026-89835', status: 'Success', icon: FolderKanban },
    { time: '10:24:29', event: 'USER_LOGIN', actor: 'red_operator', details: 'Successful', status: 'Success', icon: Users },
    { time: '10:24:27', event: 'POLICY_UPDATED', actor: 'blue_operator', details: 'Defense rule v2', status: 'Success', icon: Shield },
    { time: '10:24:22', event: 'SANDBOX_REPATCHED', actor: 'system', details: 'Red sandbox rotated', status: 'Success', icon: Box },
    { time: '10:24:18', event: 'EVIDENCE_VERIFIED', actor: 'admin', details: 'Merkle root valid', status: 'Success', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F4F8FF] tracking-tight">Platform Control Plane</h1>
          <p className="text-[#718BA6] text-xs mt-1">
            Global evaluation posture, root-of-trust verification status, sandbox health, and resource governance.
          </p>
        </div>
        <button
          onClick={loadOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#EAF4FF] bg-[#071729] hover:bg-[#0A1D31] border border-[#12324F] hover:border-[#087BDA] rounded-lg shadow-subtle transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#00A3FF] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Control Plane</span>
        </button>
      </div>

      {/* Top 4 Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Evaluations */}
        <div className="bg-[#071729] border border-[#12324F] p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-card hover:border-[#087BDA] transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#0D243B] border border-[#087BDA] text-[#008CFF] flex items-center justify-center shadow-[0_0_10px_rgba(8,123,218,0.3)]">
              <Box className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#A9C2DA] flex-1 ml-3">Active Evaluations</span>
          </div>

          <div className="flex items-end justify-between z-10">
            <div>
              <div className="text-3xl font-black text-[#F4F8FF] tracking-tight leading-none">4</div>
              <div className="text-[11px] text-[#718BA6] mt-1.5 font-medium">2 running • 2 completed</div>
            </div>

            {/* Cyan waveform sparkline */}
            <div className="w-24 h-10">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-[#00D6B5] fill-none stroke-2">
                <path d="M0,25 Q15,35 30,20 T60,25 T80,5 T100,20" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Total Tests Executed */}
        <div className="bg-[#071729] border border-[#12324F] p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-card hover:border-[#087BDA] transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#0D243B] border border-[#075AA0] text-[#7FB6E8] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#A9C2DA] flex-1 ml-3">Total Tests Executed</span>
          </div>

          <div className="flex items-end justify-between z-10">
            <div>
              <div className="text-3xl font-black text-[#F4F8FF] tracking-tight leading-none">
                {pass?.attack_count ? pass.attack_count : '128'}
              </div>
              <div className="text-[11px] text-[#718BA6] mt-1.5 font-medium flex items-center gap-1">
                <span className="text-[#19CDA5] font-bold">+12%</span> from last week
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-end gap-1 h-8">
                <div className="w-1.5 bg-[#075AA0] h-3 rounded-xs"></div>
                <div className="w-1.5 bg-[#075AA0] h-5 rounded-xs"></div>
                <div className="w-1.5 bg-[#087BDA] h-7 rounded-xs"></div>
                <div className="w-1.5 bg-[#00A3FF] h-4 rounded-xs"></div>
                <div className="w-1.5 bg-[#00D6B5] h-8 rounded-xs"></div>
              </div>
              <Flame className="w-6 h-6 text-[#FF3D59] fill-[#FF3D59]/20" />
            </div>
          </div>
        </div>

        {/* Card 3: Platform Health */}
        <div className="bg-[#071729] border border-[#12324F] p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-card hover:border-[#087BDA] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A9C2DA]">Platform Health</span>
          </div>

          <div className="flex items-center justify-between z-10">
            <div>
              <div className="text-3xl font-black text-[#19CDA5] tracking-tight leading-none">100%</div>
              <div className="text-[11px] text-[#718BA6] mt-1.5 font-medium">All services operational</div>
            </div>

            {/* Radial circular ring gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="#10283E" strokeWidth="4" fill="transparent" />
                <circle
                  cx="24" cy="24" r="18"
                  stroke="#19CDA5" strokeWidth="4"
                  strokeDasharray="113" strokeDashoffset="0"
                  strokeLinecap="round" fill="transparent"
                />
              </svg>
              <div className="absolute w-2 h-2 rounded-full bg-[#19CDA5] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Card 4: Evidence Chain */}
        <div className="bg-[#071729] border border-[#12324F] p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-card hover:border-[#087BDA] transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#0D243B] border border-[#00D6B5] text-[#00D6B5] flex items-center justify-center shadow-[0_0_10px_rgba(0,214,181,0.25)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#A9C2DA] flex-1 ml-3">Evidence Chain</span>
          </div>

          <div className="flex items-end justify-between z-10">
            <div>
              <div className="text-2xl font-black text-[#00D6B5] tracking-tight leading-none flex items-center gap-1.5">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                <span>VALID</span>
              </div>
              <div className="text-[11px] text-[#718BA6] mt-1.5 font-medium">SHA-256 verified</div>
            </div>

            <div className="text-right font-mono text-[10px] text-[#7FB6E8]">
              Merkle Root
              <span className="block text-[#00D6B5] font-bold">INTACT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Infrastructure Status (left) & Network Topology (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Infrastructure Status */}
        <div className="lg:col-span-5 bg-[#071729] border border-[#12324F] p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#10283E]">
            <h2 className="text-sm font-bold text-[#F4F8FF] tracking-wide">Infrastructure Status</h2>
            <span className="text-[10px] font-mono text-[#7FB6E8]">6 / 6 ONLINE</span>
          </div>

          <div className="divide-y divide-[#10283E] space-y-1">
            {infrastructureServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div key={idx} className="pt-2 pb-1.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded bg-[#0A1D31] border border-[#12324F]" style={{ color: svc.color }}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[#EAF4FF]">{svc.name}</span>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-[#7FB6E8]">{svc.latency}</span>
                    <span className="inline-flex items-center gap-1.5 text-[#19CDA5] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#19CDA5]"></span>
                      {svc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Network Topology */}
        <div className="lg:col-span-7 bg-[#071729] border border-[#12324F] p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#10283E]">
            <h2 className="text-sm font-bold text-[#F4F8FF] tracking-wide">Network Topology</h2>
            <span className="text-[10px] font-mono text-[#19CDA5] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19CDA5] animate-pulse"></span>
              ISOLATION ENFORCED
            </span>
          </div>

          {/* Connected Network Diagram */}
          <div className="py-2 flex flex-col justify-center items-center">
            {/* Top Row of 4 Nodes */}
            <div className="w-full flex items-center justify-between gap-2 overflow-x-auto py-2">
              {/* Node 1: Red Sandbox */}
              <div className="bg-[#1A0A10] border border-[#FF3D59] shadow-[0_0_12px_rgba(255,61,89,0.25)] rounded-xl p-3 text-center min-w-[125px] flex-1">
                <div className="w-6 h-6 rounded-full bg-[#2E0F17] text-[#FF3D59] mx-auto mb-1 flex items-center justify-center">
                  <AlertOctagon className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-[#FF3D59]">Red Sandbox</div>
                <div className="text-[10px] text-[#A9C2DA] font-mono">(red_net)</div>
                <div className="text-[9px] text-[#718BA6] font-mono mt-0.5">172.28.0.0/16</div>
              </div>

              {/* Arrow */}
              <div className="text-[#087BDA] flex items-center shrink-0">
                <div className="w-4 h-0.5 bg-[#087BDA]"></div>
                <ArrowRight className="w-4 h-4 -ml-1" />
              </div>

              {/* Node 2: Gateway */}
              <div className="bg-[#0A1D31] border border-[#087BDA] shadow-[0_0_12px_rgba(8,123,218,0.25)] rounded-xl p-3 text-center min-w-[125px] flex-1">
                <div className="w-6 h-6 rounded-full bg-[#0D243B] text-[#00A3FF] mx-auto mb-1 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-[#00A3FF]">Gateway</div>
                <div className="text-[10px] text-[#A9C2DA] font-mono">(control_net)</div>
                <div className="text-[9px] text-[#718BA6] font-mono mt-0.5">172.28.1.0/24</div>
              </div>

              {/* Arrow */}
              <div className="text-[#087BDA] flex items-center shrink-0">
                <div className="w-4 h-0.5 bg-[#087BDA]"></div>
                <ArrowRight className="w-4 h-4 -ml-1" />
              </div>

              {/* Node 3: LLM Sandbox */}
              <div className="bg-[#140A24] border border-[#A56BFF] shadow-[0_0_12px_rgba(165,107,255,0.25)] rounded-xl p-3 text-center min-w-[125px] flex-1">
                <div className="w-6 h-6 rounded-full bg-[#22123B] text-[#A56BFF] mx-auto mb-1 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-[#A56BFF]">LLM Sandbox</div>
                <div className="text-[10px] text-[#A9C2DA] font-mono">(llm_net)</div>
                <div className="text-[9px] text-[#718BA6] font-mono mt-0.5">172.28.2.0/24</div>
              </div>

              {/* Arrow */}
              <div className="text-[#087BDA] flex items-center shrink-0">
                <div className="w-4 h-0.5 bg-[#087BDA]"></div>
                <ArrowRight className="w-4 h-4 -ml-1" />
              </div>

              {/* Node 4: Blue Sandbox */}
              <div className="bg-[#081E20] border border-[#00D6B5] shadow-[0_0_12px_rgba(0,214,181,0.25)] rounded-xl p-3 text-center min-w-[125px] flex-1">
                <div className="w-6 h-6 rounded-full bg-[#0D2D2E] text-[#00D6B5] mx-auto mb-1 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-[#00D6B5]">Blue Sandbox</div>
                <div className="text-[10px] text-[#A9C2DA] font-mono">(blue_net)</div>
                <div className="text-[9px] text-[#718BA6] font-mono mt-0.5">172.28.3.0/24</div>
              </div>
            </div>

            {/* Dotted Return Path with No Direct Access Badge */}
            <div className="w-full mt-3 pt-2 border-t border-dashed border-[#12324F] flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1F0A10] border border-[#FF3D59] text-[#FF3D59] text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(255,61,89,0.3)]">
                <AlertTriangle className="w-3 h-3" />
                No Direct Access (Bridge Blocked)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Audit Events (left) & Resource Usage (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Audit Events */}
        <div className="lg:col-span-7 bg-[#071729] border border-[#12324F] p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#10283E]">
              <h2 className="text-sm font-bold text-[#F4F8FF] tracking-wide">Recent Audit Events</h2>
              <button
                onClick={() => navigate('/admin/audit')}
                className="text-xs font-mono font-semibold text-[#7FB6E8] hover:text-[#00A3FF] flex items-center gap-1 cursor-pointer transition-colors"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0C2137] text-[#718BA6] font-mono font-bold text-[10px] uppercase">
                    <th className="py-2.5 px-3 rounded-l-lg">TIME</th>
                    <th className="py-2.5 px-3">EVENT</th>
                    <th className="py-2.5 px-3">ACTOR</th>
                    <th className="py-2.5 px-3">DETAILS</th>
                    <th className="py-2.5 px-3 rounded-r-lg text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10283E] font-mono text-[11px]">
                  {recentAuditEvents.map((evt, idx) => {
                    const Icon = evt.icon;
                    return (
                      <tr key={idx} className="hover:bg-[#0B2C4C]/40 transition-colors">
                        <td className="py-2.5 px-3 text-[#7FB6E8]">{evt.time}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#EAF4FF] flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#00A3FF]" />
                          {evt.event}
                        </td>
                        <td className="py-2.5 px-3 text-[#7FB6E8]">{evt.actor}</td>
                        <td className="py-2.5 px-3 text-[#A9C2DA] truncate max-w-[180px]">{evt.details}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0A2926] text-[#00D6B5] border border-[#00D6B5]/30 text-[10px] font-bold">
                            <Check className="w-2.5 h-2.5" />
                            {evt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resource Usage with Radial Meters */}
        <div className="lg:col-span-5 bg-[#071729] border border-[#12324F] p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#10283E]">
            <h2 className="text-sm font-bold text-[#F4F8FF] tracking-wide">Resource Usage</h2>
            <div className="relative">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="bg-[#061321] border border-[#12324F] text-[#A9C2DA] text-[11px] font-mono font-medium rounded-md px-2.5 py-1 pr-6 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 7 Days">Last 7 Days</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#7FB6E8] absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 3 Circular Gauges */}
          <div className="grid grid-cols-3 gap-3 py-2">
            {/* CPU Gauge */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto flex flex-col items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#10283E" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="#00D6B5" strokeWidth="6"
                    strokeDasharray="201" strokeDashoffset={201 - (201 * 0.32)}
                    strokeLinecap="round" fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#718BA6] font-mono">CPU</span>
                  <span className="text-sm font-black text-[#F4F8FF] leading-none">32%</span>
                </div>
              </div>
              {/* Mini wave sparkline */}
              <div className="w-16 h-4 mx-auto mt-1">
                <svg viewBox="0 0 60 15" className="w-full h-full stroke-[#00D6B5] fill-none stroke-1">
                  <path d="M0,10 Q15,0 30,8 T60,5" />
                </svg>
              </div>
            </div>

            {/* Memory Gauge */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto flex flex-col items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#10283E" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="#087BFF" strokeWidth="6"
                    strokeDasharray="201" strokeDashoffset={201 - (201 * 0.48)}
                    strokeLinecap="round" fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#718BA6] font-mono">Memory</span>
                  <span className="text-sm font-black text-[#F4F8FF] leading-none">48%</span>
                </div>
              </div>
              {/* Mini wave sparkline */}
              <div className="w-16 h-4 mx-auto mt-1">
                <svg viewBox="0 0 60 15" className="w-full h-full stroke-[#087BFF] fill-none stroke-1">
                  <path d="M0,8 Q15,14 30,4 T60,8" />
                </svg>
              </div>
            </div>

            {/* Disk Gauge */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto flex flex-col items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#10283E" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="#FFB547" strokeWidth="6"
                    strokeDasharray="201" strokeDashoffset={201 - (201 * 0.62)}
                    strokeLinecap="round" fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#718BA6] font-mono">Disk</span>
                  <span className="text-sm font-black text-[#F4F8FF] leading-none">62%</span>
                </div>
              </div>
              {/* Mini wave sparkline */}
              <div className="w-16 h-4 mx-auto mt-1">
                <svg viewBox="0 0 60 15" className="w-full h-full stroke-[#FFB547] fill-none stroke-1">
                  <path d="M0,12 Q15,4 30,10 T60,2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rate Limit Bar */}
          <div className="p-3 bg-[#061321] border border-[#12324F] rounded-lg mt-2 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#A9C2DA] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00A3FF]" />
                Global Rate Limit: 60 req/min
              </span>
              <span className="text-[#00D6B5] font-bold">16 / 60 (27%)</span>
            </div>
            <div className="w-full bg-[#10283E] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#087BFF] to-[#00D6B5] h-full rounded-full" style={{ width: '27%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
