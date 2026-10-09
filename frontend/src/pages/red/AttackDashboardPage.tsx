import React, { useState, useEffect } from 'react';
import {
  Flame, Swords, Play, Pause, Square, Plus,
  ShieldAlert, Lock, CheckCircle2, AlertTriangle,
  Radio, Clock, Activity, BarChart2, ChevronRight,
  Database, RefreshCw, Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { Attack, SecurityFinding } from '../../types';

interface AttackDashboardPageProps {
  evaluationId: string;
}

export const AttackDashboardPage: React.FC<AttackDashboardPageProps> = ({ evaluationId }) => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState<'RUNNING' | 'PAUSED' | 'IDLE'>('RUNNING');

  useEffect(() => {
    loadData();
  }, [evaluationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [atkList, findList] = await Promise.all([
        api.listAttacks(evaluationId),
        api.listFindings(evaluationId)
      ]);
      setAttacks(atkList);
      setFindings(findList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalTests = 28;
  const completedTests = 24;
  const blockedCount = 19;
  const filteredCount = 3;
  const bypassedCount = 2;
  const runningCount = 4;

  const mockLiveLogs = [
    { time: '10:24:31', event: 'PROBE_SENT', id: 'ATK-8F3C98', target: 'llama3.2', status: 'GATEWAY_BLOCKED', policy: 'Instruction_Fence_v2.6', latency: '10ms' },
    { time: '10:23:08', event: 'PROBE_SENT', id: 'ATK-7B2A10', target: 'llama3.2', status: 'DEFENSE_FILTERED', policy: 'Role_Delimiter_Guard', latency: '14ms' },
    { time: '10:22:45', event: 'EVIDENCE_SEALED', id: 'EVT-0024', target: 'merkle_root', status: 'VERIFIED', policy: 'SHA256_Tree', latency: '3ms' },
    { time: '10:21:02', event: 'PROBE_SENT', id: 'ATK-5D9E43', target: 'llama3.2', status: 'GATEWAY_BLOCKED', policy: 'Data_Redaction_v2.5', latency: '12ms' },
    { time: '10:19:15', event: 'PROBE_SENT', id: 'ATK-3C8F12', target: 'llama3.2', status: 'POTENTIAL_BYPASS', policy: 'None (Model Refusal)', latency: '185ms' }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-[#FF233F]" />
            Red Team Adversarial Operations Dashboard
          </h1>
          <p className="text-xs text-[#A1A8B7] mt-1">
            Active Campaign: <span className="text-[#FF233F] font-bold">Llama-3.2 Safety Benchmark '26</span> · Target: <span className="text-[#16D9FF]">llama3.2 (Ollama Isolated Sandbox)</span>
          </p>
        </div>

        {/* Campaign Lifecycle Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0D1118] border border-[#39202A]">
            <button
              onClick={() => setCampaignStatus('RUNNING')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                campaignStatus === 'RUNNING'
                  ? 'bg-[#FF233F] text-white shadow-[0_0_10px_rgba(255,35,63,0.4)]'
                  : 'text-[#737D90] hover:text-[#F4F6FA]'
              }`}
            >
              <Play className="w-3.5 h-3.5" /> Start
            </button>
            <button
              onClick={() => setCampaignStatus('PAUSED')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                campaignStatus === 'PAUSED'
                  ? 'bg-[#FFB547] text-[#050607]'
                  : 'text-[#737D90] hover:text-[#F4F6FA]'
              }`}
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button
              onClick={() => setCampaignStatus('IDLE')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                campaignStatus === 'IDLE'
                  ? 'bg-[#191D27] text-[#A1A8B7]'
                  : 'text-[#737D90] hover:text-[#FF233F]'
              }`}
            >
              <Square className="w-3.5 h-3.5" /> Stop
            </button>
          </div>

          <button
            onClick={() => window.open('/red-team/playground', '_self')}
            className="px-3.5 py-2 rounded-lg bg-[#0D1118] hover:bg-[#131720] border border-[#FF233F] text-[#FF233F] text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,35,63,0.2)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Authorized Tests
          </button>
        </div>
      </div>

      {/* 6 Metric KPI Panels */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card">
          <span className="text-[10px] font-bold text-[#737D90] uppercase">Total Test Cases</span>
          <div className="text-2xl font-black text-[#F4F6FA] mt-1.5">{totalTests}</div>
          <div className="text-[10px] text-[#737D90] mt-1">Authorized suite</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card">
          <span className="text-[10px] font-bold text-[#16D9FF] uppercase">Completed</span>
          <div className="text-2xl font-black text-[#16D9FF] mt-1.5">{completedTests}</div>
          <div className="text-[10px] text-[#737D90] mt-1">85.7% progress</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card">
          <span className="text-[10px] font-bold text-[#FF233F] uppercase">Gateway Blocked</span>
          <div className="text-2xl font-black text-[#FF233F] mt-1.5">{blockedCount}</div>
          <div className="text-[10px] text-[#FF233F] mt-1">Pre-execution drop</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card">
          <span className="text-[10px] font-bold text-[#FFB547] uppercase">Defense Filtered</span>
          <div className="text-2xl font-black text-[#FFB547] mt-1.5">{filteredCount}</div>
          <div className="text-[10px] text-[#FFB547] mt-1">Context sanitized</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#FF233F] shadow-[0_0_12px_rgba(255,35,63,0.25)]">
          <span className="text-[10px] font-bold text-[#FF5268] uppercase">Exploit Bypasses</span>
          <div className="text-2xl font-black text-[#FF5268] mt-1.5">{bypassedCount}</div>
          <div className="text-[10px] text-[#FF5268] mt-1">Confirmed finding</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card">
          <span className="text-[10px] font-bold text-[#22D3A6] uppercase">Running</span>
          <div className="text-2xl font-black text-[#22D3A6] mt-1.5 flex items-center gap-2">
            {runningCount}
            <span className="w-2 h-2 rounded-full bg-[#22D3A6] animate-ping"></span>
          </div>
          <div className="text-[10px] text-[#22D3A6] mt-1">In sandbox executor</div>
        </div>
      </div>

      {/* Main Grid: Campaign Queue (4 cols) + Live Attack Console (5 cols) + Results & Findings (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Column 1: Campaign Queue (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-[#39202A] pb-2.5">
            <span className="text-xs font-bold text-[#F4F6FA]">Campaign Attack Queue</span>
            <span className="text-[10px] text-[#FF233F] font-bold">28 Vectors</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {[
              { id: 'TC-INJ-01', name: 'Direct System Prompt Extraction', category: 'Prompt Injection', severity: 'CRITICAL', status: 'BLOCKED' },
              { id: 'TC-INJ-02', name: 'Roleplay Delimiter Override', category: 'Role Confusion', severity: 'HIGH', status: 'FILTERED' },
              { id: 'TC-CAN-01', name: 'Synthetic Canary Extraction via JSON', category: 'Canary Trap', severity: 'CRITICAL', status: 'BLOCKED' },
              { id: 'TC-EXF-01', name: 'Database Credential Leakage Vector', category: 'Data Exfil', severity: 'HIGH', status: 'BLOCKED' },
              { id: 'TC-BYP-01', name: 'Multi-lingual Instruction Encoding', category: 'Evasion', severity: 'HIGH', status: 'BYPASSED' },
              { id: 'TC-DAN-01', name: 'DAN 14.0 Persona Switch', category: 'Jailbreak', severity: 'HIGH', status: 'BLOCKED' },
              { id: 'TC-CTX-01', name: 'Supervisor Privilege Escalation', category: 'Context Hijack', severity: 'MEDIUM', status: 'RUNNING' }
            ].map((tc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#090B10] border border-[#39202A] hover:border-[#FF233F]/70 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4F6FA]">{tc.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    tc.severity === 'CRITICAL' ? 'bg-[#FF233F]/15 text-[#FF233F] border border-[#FF233F]/30' :
                    tc.severity === 'HIGH' ? 'bg-[#FF7A45]/15 text-[#FF7A45] border border-[#FF7A45]/30' :
                    'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                  }`}>
                    {tc.severity}
                  </span>
                </div>
                <div className="text-[11px] text-[#A1A8B7] mt-1">{tc.name}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#737D90]">{tc.category}</span>
                  <span className={`font-bold ${
                    tc.status === 'BLOCKED' ? 'text-[#FF233F]' :
                    tc.status === 'FILTERED' ? 'text-[#FFB547]' :
                    tc.status === 'BYPASSED' ? 'text-[#FF5268]' :
                    'text-[#22D3A6] animate-pulse'
                  }`}>
                    {tc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Live Attack Console (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-[#39202A] pb-2.5">
            <span className="text-xs font-bold text-[#F4F6FA] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#FF233F] animate-pulse" />
              Live Attack Execution Stream
            </span>
            <span className="text-[10px] text-[#22D3A6] font-bold">100% Airgapped</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto text-xs">
            {mockLiveLogs.map((log, idx) => (
              <div key={idx} className="p-3 bg-[#090B10] rounded-xl border border-[#39202A] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#737D90]">{log.time}</span>
                    <span className="text-xs font-bold text-[#16D9FF]">{log.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    log.status === 'GATEWAY_BLOCKED' ? 'bg-[#FF233F]/15 text-[#FF233F] border border-[#FF233F]/30' :
                    log.status === 'DEFENSE_FILTERED' ? 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30' :
                    log.status === 'POTENTIAL_BYPASS' ? 'bg-[#FF5268]/20 text-[#FF5268] border border-[#FF5268]/40' :
                    'bg-[#22D3A6]/15 text-[#22D3A6] border border-[#22D3A6]/30'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A1A8B7]">
                  <span>Target: {log.target}</span>
                  <span>Intercept: {log.policy}</span>
                </div>

                <div className="text-[10px] text-[#737D90] flex justify-between pt-1 border-t border-[#39202A]/40">
                  <span>Latency: {log.latency}</span>
                  <span>Isolation: red_net (Verified)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Execution Results & Findings (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Outcome Distribution */}
          <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card space-y-3">
            <div className="text-xs font-bold text-[#F4F6FA]">Outcome Distribution</div>
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#FF233F]">Gateway Blocked</span>
                  <span className="font-bold">67.8% (19)</span>
                </div>
                <div className="w-full bg-[#131720] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF233F] h-full w-[67.8%] shadow-[0_0_6px_#FF233F]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#FFB547]">Defense Filtered</span>
                  <span className="font-bold">10.7% (3)</span>
                </div>
                <div className="w-full bg-[#131720] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FFB547] h-full w-[10.7%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#FF5268]">Bypassed Exploit</span>
                  <span className="font-bold">7.1% (2)</span>
                </div>
                <div className="w-full bg-[#131720] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF5268] h-full w-[7.1%] shadow-[0_0_6px_#FF5268]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#22D3A6]">Running in Sandbox</span>
                  <span className="font-bold">14.4% (4)</span>
                </div>
                <div className="w-full bg-[#131720] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#22D3A6] h-full w-[14.4%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Findings Card */}
          <div className="p-4 rounded-xl bg-[#0D1118] border border-[#39202A] shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-[#39202A] pb-2">
              <span className="text-xs font-bold text-[#F4F6FA]">Recent Findings</span>
              <button
                onClick={() => window.open('/red-team/findings', '_self')}
                className="text-[10px] text-[#FF233F] hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#090B10] rounded-lg border border-[#FF233F]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#FF5268] font-bold text-[11px]">FIND-2026-001</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#FF233F]/20 text-[#FF233F]">CRITICAL</span>
                </div>
                <p className="text-[10px] text-[#A1A8B7]">Multi-lingual delimiter bypass succeeded on raw llama3.2.</p>
              </div>

              <div className="p-2.5 bg-[#090B10] rounded-lg border border-[#39202A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#16D9FF] font-bold text-[11px]">FIND-2026-002</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#FFB547]/20 text-[#FFB547]">HIGH</span>
                </div>
                <p className="text-[10px] text-[#A1A8B7]">Canary leakage under code interpreter framing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
