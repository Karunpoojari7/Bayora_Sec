import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, Square, Plus, Shield, FlaskConical, Box,
  Filter, Target, Cpu, ChevronDown, Radio, ChevronRight,
  ArrowUpRight, Check, X, ArrowUp, ArrowDown, Send,
  ShieldCheck, ShieldAlert, Database, MessageSquare,
  FileCode, CheckCircle2, AlertTriangle, Bug, Layers,
  ExternalLink, Clock, Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Attack, SecurityFinding } from '../../types';

interface AttackDashboardPageProps {
  evaluationId: string;
}

// Custom Mini Sparkline SVG
const Sparkline: React.FC<{ color: string; data?: number[]; id: string }> = ({ color, data, id }) => {
  const points = data || [10, 25, 18, 32, 28, 45, 38, 55, 48, 65, 75];
  const max = Math.max(...points, 80);
  const min = Math.min(...points, 0);
  const width = 80;
  const height = 30;

  const pts = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const areaPts = `0,${height} ${pts} ${width},${height}`;

  return (
    <svg className="w-20 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#grad-${id})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AttackDashboardPage: React.FC<AttackDashboardPageProps> = ({ evaluationId }) => {
  const navigate = useNavigate();
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState<'RUNNING' | 'PAUSED' | 'IDLE'>('RUNNING');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  const [eventFilter, setEventFilter] = useState<string>('ALL');

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

  // Campaign Attack Queue items
  const [queueItems, setQueueItems] = useState([
    { num: '01', id: 'TC-INJ-01', name: 'Prompt Injection', category: 'Prompt Injection', severity: 'CRITICAL', status: 'Running' },
    { num: '02', id: 'TC-INJ-02', name: 'Role Confusion', category: 'Role Confusion', severity: 'HIGH', status: 'Pending' },
    { num: '03', id: 'TC-CAN-01', name: 'Canary Trap', category: 'Canary Trap', severity: 'CRITICAL', status: 'Pending' },
    { num: '04', id: 'TC-EXF-01', name: 'Data Exfiltration', category: 'Data Exfiltration', severity: 'HIGH', status: 'Pending' },
    { num: '05', id: 'TC-BYP-01', name: 'Multi-Lingual Jailbreak', category: 'Multi-Lingual Jailbreak', severity: 'HIGH', status: 'Pending' },
    { num: '06', id: 'TC-DAN-01', name: 'Persona Switch', category: 'Persona Switch', severity: 'MEDIUM', status: 'Pending' },
    { num: '07', id: 'TC-CTX-01', name: 'Context Manipulation', category: 'Context Manipulation', severity: 'MEDIUM', status: 'Pending' },
    { num: '08', id: 'TC-TOOL-01', name: 'Tool Abuse', category: 'Tool Abuse', severity: 'HIGH', status: 'Pending' },
    { num: '09', id: 'TC-PRIV-01', name: 'Sensitive Data', category: 'Sensitive Data', severity: 'CRITICAL', status: 'Pending' },
    { num: '10', id: 'TC-ENC-01', name: 'Instruction Encoding', category: 'Instruction Encoding', severity: 'MEDIUM', status: 'Pending' }
  ]);

  const filteredQueue = queueItems.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.severity.toUpperCase() === selectedCategory.toUpperCase();
  });

  const toggleSelectQueue = (id: string) => {
    setSelectedQueueIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQueueIds.length === filteredQueue.length) {
      setSelectedQueueIds([]);
    } else {
      setSelectedQueueIds(filteredQueue.map(q => q.id));
    }
  };

  const moveQueue = (direction: 'up' | 'down') => {
    if (selectedQueueIds.length === 0) return;
    setQueueItems(prev => {
      const copy = [...prev];
      if (direction === 'up') {
        for (let i = 1; i < copy.length; i++) {
          if (selectedQueueIds.includes(copy[i].id) && !selectedQueueIds.includes(copy[i - 1].id)) {
            const temp = copy[i];
            copy[i] = copy[i - 1];
            copy[i - 1] = temp;
          }
        }
      } else {
        for (let i = copy.length - 2; i >= 0; i--) {
          if (selectedQueueIds.includes(copy[i].id) && !selectedQueueIds.includes(copy[i + 1].id)) {
            const temp = copy[i];
            copy[i] = copy[i + 1];
            copy[i + 1] = temp;
          }
        }
      }
      return copy;
    });
  };

  // Execution Stream Log Items matching design
  const executionLogs = [
    { time: '10:24:31', event: 'Request Sent', type: 'sent', testCase: 'ATK-8F3C98', details: 'Prompt injection attempt...', outcome: 'SENT', latency: '12ms' },
    { time: '10:24:32', event: 'Gateway Evaluated', type: 'block', testCase: 'ATK-8F3C98', details: 'Policy v2.6', outcome: 'BLOCKED', latency: '18ms' },
    { time: '10:24:35', event: 'Request Sent', type: 'sent', testCase: 'ATK-7B2A10', details: 'Role confusion test', outcome: 'SENT', latency: '9ms' },
    { time: '10:24:36', event: 'Defense Filtered', type: 'filter', testCase: 'ATK-7B2A10', details: 'Content filter match', outcome: 'FILTERED', latency: '14ms' },
    { time: '10:24:41', event: 'Request Sent', type: 'sent', testCase: 'ATK-5D9E43', details: 'Data exfiltration probe', outcome: 'SENT', latency: '11ms' },
    { time: '10:24:43', event: 'Model Response', type: 'allowed', testCase: 'ATK-5D9E43', details: 'Llama3.2 response received', outcome: 'ALLOWED', latency: '1.2s' },
    { time: '10:24:43', event: 'Outcome Classified', type: 'safe', testCase: 'ATK-5D9E43', details: 'No sensitive data detected', outcome: 'SAFE', latency: '-' },
    { time: '10:24:51', event: 'Request Sent', type: 'sent', testCase: 'ATK-3C8F12', details: 'System prompt extraction', outcome: 'SENT', latency: '10ms' },
    { time: '10:24:52', event: 'Model Refusal', type: 'refuse', testCase: 'ATK-3C8F12', details: 'Refused (safety policy)', outcome: 'REFUSED', latency: '842ms' },
    { time: '10:24:58', event: 'Request Sent', type: 'sent', testCase: 'ATK-9A2D11', details: 'Multi-turn jailbreak', outcome: 'SENT', latency: '13ms' },
    { time: '10:24:59', event: 'Gateway Blocked', type: 'block', testCase: 'ATK-9A2D11', details: 'Regex rule v1.5', outcome: 'BLOCKED', latency: '6ms' },
    { time: '10:25:03', event: 'Request Sent', type: 'sent', testCase: 'ATK-1F7E90', details: 'Tool use boundary test', outcome: 'SENT', latency: '11ms' },
  ];

  return (
    <div className="space-y-4 font-sans text-[#e2e8f0]">
      {/* Header & Persistent Campaign Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Adversarial Operations Center
          </h1>
          <p className="text-xs text-[#8c9baeff] mt-0.5 font-normal">
            Execute adversarial tests, analyze defense responses, and discover security weaknesses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCampaignStatus('RUNNING')}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#f87171] hover:to-[#ef4444] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Campaign</span>
          </button>

          <button
            onClick={() => setCampaignStatus('PAUSED')}
            className="px-3 py-1.5 rounded-lg bg-[#0b0f19] hover:bg-[#151c2d] border border-[#1f293d] text-[#c4d1e2] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>

          <button
            onClick={() => setCampaignStatus('IDLE')}
            className="px-3 py-1.5 rounded-lg bg-[#0b0f19] hover:bg-[#151c2d] border border-[#1f293d] text-[#c4d1e2] hover:text-[#ef4444] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3 h-3 fill-red-500 text-red-500" />
            <span>Stop</span>
          </button>

          <button
            onClick={() => navigate('/red-team/playground')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0b0f19] hover:bg-[#1a0b12] border border-[#ef4444]/60 hover:border-[#ef4444] text-[#ef4444] hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.15)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Authorized Tests</span>
          </button>
        </div>
      </div>

      {/* 6 Compact Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: CAMPAIGNS ACTIVE */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#250910] border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
              <Box className="w-4 h-4 text-[#ef4444]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              CAMPAIGNS ACTIVE
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">3</span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center">
              ↑ +50%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">2 running • 1 queued</span>
            <Sparkline color="#ef4444" id="kpi-1" data={[1, 2, 2, 3, 2, 3, 3]} />
          </div>
        </div>

        {/* Card 2: TESTS EXECUTED */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#07212b] border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
              <FlaskConical className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              TESTS EXECUTED
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">128</span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center">
              ↑ +12%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">+12k from last week</span>
            <Sparkline color="#06b6d4" id="kpi-2" data={[40, 55, 60, 85, 95, 110, 128]} />
          </div>
        </div>

        {/* Card 3: GATEWAY BLOCKED */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#ef4444]/30 flex flex-col justify-between relative overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.1)]">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#250910] border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <Shield className="w-4 h-4 text-[#ef4444]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              GATEWAY BLOCKED
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">67</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#350a12] text-[#ef4444] border border-[#ef4444]/30 font-mono">
              52.3%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">Blocked at gateway</span>
            <Sparkline color="#ef4444" id="kpi-3" data={[20, 30, 28, 45, 52, 60, 67]} />
          </div>
        </div>

        {/* Card 4: DEFENSE FILTERED */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#271d09] border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
              <Filter className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              DEFENSE FILTERED
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">18</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#38270c] text-[#f59e0b] border border-[#f59e0b]/30 font-mono">
              14.1%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">Filtered by policies</span>
            <Sparkline color="#f59e0b" id="kpi-4" data={[5, 8, 12, 11, 15, 16, 18]} />
          </div>
        </div>

        {/* Card 5: POTENTIAL BYPASSES */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#ef4444]/40 flex flex-col justify-between relative overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.15)]">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#250910] border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <Target className="w-4 h-4 text-[#ef4444]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              POTENTIAL BYPASSES
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">9</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#350a12] text-[#ef4444] border border-[#ef4444]/30 font-mono">
              7.0%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">Requires review</span>
            <Sparkline color="#ef4444" id="kpi-5" data={[2, 3, 4, 3, 6, 7, 9]} />
          </div>
        </div>

        {/* Card 6: SANDBOX WORKERS */}
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#06241b] border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <Cpu className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-[10px] font-bold text-[#8c9baeff] tracking-wider uppercase font-mono">
              SANDBOX WORKERS
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">4/4</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0b3324] text-emerald-400 border border-emerald-500/30 font-mono">
              100%
            </span>
          </div>
          <div className="flex items-end justify-between mt-1 pt-1 border-t border-[#17212f]">
            <span className="text-[10px] text-[#78859b] font-mono">All systems healthy</span>
            <Sparkline color="#10b981" id="kpi-6" data={[4, 4, 4, 4, 4, 4, 4]} />
          </div>
        </div>
      </div>

      {/* Main Workspace (3-Column Dense Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Column 1: Campaign Attack Queue (4 cols) */}
        <div className="lg:col-span-4 p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between shadow-sm">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#17212f]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ef4444]" />
                <span className="text-xs font-bold text-white">Campaign Attack Queue</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#250910] border border-[#ef4444]/30 px-2 py-0.5 rounded">
                28 test cases
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 pb-2 overflow-x-auto text-[11px] font-mono font-medium">
              {[
                { label: 'All (28)', val: 'ALL', color: 'text-white' },
                { label: 'Critical (6)', val: 'CRITICAL', color: 'text-[#ef4444]' },
                { label: 'High (9)', val: 'HIGH', color: 'text-[#f97316]' },
                { label: 'Medium (8)', val: 'MEDIUM', color: 'text-[#eab308]' },
                { label: 'Low (5)', val: 'LOW', color: 'text-[#3b82f6]' },
              ].map(tab => (
                <button
                  key={tab.val}
                  onClick={() => setSelectedCategory(tab.val)}
                  className={`px-2 py-1 rounded transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === tab.val
                      ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                      : 'bg-[#0f1420] text-[#78859b] hover:text-white hover:bg-[#151c2c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-1 px-2 py-1.5 text-[10px] font-mono text-[#64748b] font-bold uppercase bg-[#080c14] rounded-lg mt-1">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedQueueIds.length === filteredQueue.length && filteredQueue.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded bg-[#0f1420] border-[#223049] text-[#ef4444] focus:ring-0 w-3 h-3 cursor-pointer"
                />
              </div>
              <div className="col-span-1">#</div>
              <div className="col-span-4">TEST CASE</div>
              <div className="col-span-3">CATEGORY</div>
              <div className="col-span-3 text-right">STATUS</div>
            </div>

            {/* Queue List Rows */}
            <div className="mt-1 space-y-1 max-h-[380px] overflow-y-auto pr-0.5 text-xs font-mono">
              {filteredQueue.map((item) => {
                const isSelected = selectedQueueIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelectQueue(item.id)}
                    className={`grid grid-cols-12 gap-1 items-center px-2 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e0a12] border-[#ef4444]/60 text-white'
                        : 'bg-[#080c14]/60 border-[#151d2c] hover:bg-[#0d131f] hover:border-[#223049] text-[#d4dde8]'
                    }`}
                  >
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded bg-[#0f1420] border-[#223049] text-[#ef4444] focus:ring-0 w-3 h-3 pointer-events-none"
                      />
                    </div>
                    <div className="col-span-1 text-[10px] text-[#64748b]">{item.num}</div>
                    <div className="col-span-4 font-semibold text-[11px] truncate text-white">
                      {item.id}
                    </div>
                    <div className="col-span-3 text-[10px] text-[#8c9baeff] truncate">
                      {item.name}
                    </div>
                    <div className="col-span-3 text-right">
                      {item.status === 'Running' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950/60 text-cyan-400 border border-cyan-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          Running
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#64748b] font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2.5 mt-2 border-t border-[#17212f] flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-[#64748b]">
              {selectedQueueIds.length} selected
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => moveQueue('up')}
                className="px-2 py-1 rounded bg-[#0f1420] hover:bg-[#182030] text-[#8c9baeff] text-[10px] flex items-center gap-1 border border-[#1f293d] cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" /> Move Up
              </button>
              <button
                onClick={() => moveQueue('down')}
                className="px-2 py-1 rounded bg-[#0f1420] hover:bg-[#182030] text-[#8c9baeff] text-[10px] flex items-center gap-1 border border-[#1f293d] cursor-pointer"
              >
                <ArrowDown className="w-3 h-3" /> Move Down
              </button>
              <button
                className="px-2.5 py-1 rounded bg-[#ef4444] hover:bg-[#dc2626] text-white text-[10px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <Play className="w-2.5 h-2.5 fill-white" /> Run Selected ({selectedQueueIds.length})
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Live Attack Execution Stream (5 cols) */}
        <div className="lg:col-span-5 p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] flex flex-col justify-between shadow-sm">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#17212f]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#ef4444] animate-pulse" />
                <span className="text-xs font-bold text-white">Live Attack Execution Stream</span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live
                </span>
              </div>
              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="bg-[#080c14] border border-[#1f293d] text-[10px] font-mono text-[#8c9baeff] rounded px-2 py-1 pr-5 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Events</option>
                  <option value="BLOCKED">Blocked Only</option>
                  <option value="FILTERED">Filtered Only</option>
                  <option value="ALLOWED">Allowed Only</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#64748b] absolute right-1.5 top-1.5 pointer-events-none" />
              </div>
            </div>

            {/* Stream Table Header */}
            <div className="grid grid-cols-12 gap-1 px-2 py-1.5 text-[10px] font-mono text-[#64748b] font-bold uppercase bg-[#080c14] rounded-lg mt-2">
              <div className="col-span-2">TIME</div>
              <div className="col-span-3">EVENT</div>
              <div className="col-span-2">TEST CASE</div>
              <div className="col-span-3">DETAILS</div>
              <div className="col-span-1 text-center">OUTCOME</div>
              <div className="col-span-1 text-right">LATENCY</div>
            </div>

            {/* Execution Stream Rows */}
            <div className="mt-1 space-y-1 max-h-[415px] overflow-y-auto pr-0.5 text-xs font-mono">
              {executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-1 items-center px-2 py-1.5 rounded-lg bg-[#080c14]/40 border border-[#151d2c] hover:bg-[#0d131f] text-[11px] transition-all"
                >
                  <div className="col-span-2 text-[10px] text-[#64748b]">{log.time}</div>
                  <div className="col-span-3 flex items-center gap-1.5 font-medium truncate text-white">
                    {log.type === 'sent' && <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0" />}
                    {log.type === 'block' && <Shield className="w-3 h-3 text-[#ef4444] shrink-0" />}
                    {log.type === 'filter' && <Filter className="w-3 h-3 text-amber-400 shrink-0" />}
                    {log.type === 'allowed' && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                    {log.type === 'safe' && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                    {log.type === 'refuse' && <X className="w-3 h-3 text-purple-400 shrink-0" />}
                    <span className="truncate">{log.event}</span>
                  </div>
                  <div className="col-span-2 font-bold text-[10px] text-cyan-400 truncate">
                    {log.testCase}
                  </div>
                  <div className="col-span-3 text-[10px] text-[#8c9baeff] truncate">
                    {log.details}
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                      log.outcome === 'BLOCKED' ? 'bg-[#350a12] text-[#ef4444] border border-[#ef4444]/30' :
                      log.outcome === 'FILTERED' ? 'bg-[#38270c] text-amber-400 border border-amber-500/30' :
                      log.outcome === 'ALLOWED' ? 'bg-[#0b3324] text-emerald-400 border border-emerald-500/30' :
                      log.outcome === 'REFUSED' ? 'bg-[#290d38] text-purple-400 border border-purple-500/30' :
                      log.outcome === 'SAFE' ? 'bg-[#0b2738] text-cyan-400 border border-cyan-500/30' :
                      'bg-[#0f1a2e] text-[#60a5fa] border border-blue-500/30'
                    }`}>
                      {log.outcome}
                    </span>
                  </div>
                  <div className="col-span-1 text-right text-[9px] text-[#64748b]">
                    {log.latency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Outcome Distribution & Recent Findings (3 cols) */}
        <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
          {/* Top Card: Outcome Distribution */}
          <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#17212f]">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#ef4444]" />
                <span className="text-xs font-bold text-white">Outcome Distribution</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748b]">Last 24 Hours ▾</span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs font-mono">
              {/* Gateway Blocked */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-[#ef4444]">
                    <Shield className="w-3 h-3" /> Gateway Blocked
                  </span>
                  <span className="font-bold text-white">67.8% (87)</span>
                </div>
                <div className="h-1.5 w-full bg-[#151d2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ef4444] to-[#b91c1c] w-[67.8%] rounded-full shadow-[0_0_6px_#ef4444]"></div>
                </div>
              </div>

              {/* Defense Filtered */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Filter className="w-3 h-3" /> Defense Filtered
                  </span>
                  <span className="font-bold text-white">18.7% (24)</span>
                </div>
                <div className="h-1.5 w-full bg-[#151d2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-[18.7%] rounded-full shadow-[0_0_6px_#f59e0b]"></div>
                </div>
              </div>

              {/* Model Refused */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <X className="w-3 h-3" /> Model Refused
                  </span>
                  <span className="font-bold text-white">5.5% (7)</span>
                </div>
                <div className="h-1.5 w-full bg-[#151d2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-[5.5%] rounded-full shadow-[0_0_6px_#a855f7]"></div>
                </div>
              </div>

              {/* Potential Bypass */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-[#ff3355]">
                    <Target className="w-3 h-3" /> Potential Bypass
                  </span>
                  <span className="font-bold text-white">7.0% (9)</span>
                </div>
                <div className="h-1.5 w-full bg-[#151d2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff3355] to-[#dc2626] w-[7.0%] rounded-full shadow-[0_0_6px_#ff3355]"></div>
                </div>
              </div>

              {/* In Sandbox Running */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="w-3 h-3" /> In Sandbox (Running)
                  </span>
                  <span className="font-bold text-white">1.0% (1)</span>
                </div>
                <div className="h-1.5 w-full bg-[#151d2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 w-[1.0%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Recent Findings */}
          <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] shadow-sm flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#17212f]">
              <div className="flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-[#ef4444]" />
                <span className="text-xs font-bold text-white">Recent Findings</span>
              </div>
              <button
                onClick={() => navigate('/red-team/findings')}
                className="text-[10px] font-mono text-[#ef4444] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-2.5 space-y-2">
              {/* Finding 1 */}
              <div
                onClick={() => navigate('/red-team/findings')}
                className="p-2.5 rounded-lg bg-[#080c14] border border-[#ef4444]/40 hover:border-[#ef4444] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono text-[#ef4444] group-hover:underline">
                    FIND-2026-001
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#350a12] text-[#ef4444] border border-[#ef4444]/30 font-mono">
                    CRITICAL
                  </span>
                </div>
                <p className="text-[10px] text-[#c4d1e2] mt-1 line-clamp-2 leading-relaxed">
                  Multi-lingual delimiter bypass succeeded on raw llama3.2.
                </p>
                <div className="text-[9px] font-mono text-[#64748b] mt-1.5">
                  10:21:43 • ATK-5D9E43
                </div>
              </div>

              {/* Finding 2 */}
              <div
                onClick={() => navigate('/red-team/findings')}
                className="p-2.5 rounded-lg bg-[#080c14] border border-[#1f293d] hover:border-amber-500/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono text-amber-400 group-hover:underline">
                    FIND-2026-002
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#38270c] text-amber-400 border border-amber-500/30 font-mono">
                    HIGH
                  </span>
                </div>
                <p className="text-[10px] text-[#c4d1e2] mt-1 line-clamp-2 leading-relaxed">
                  Canary leakage under code interpreter framing.
                </p>
                <div className="text-[9px] font-mono text-[#64748b] mt-1.5">
                  09:58:12 • ATK-3C8F12
                </div>
              </div>

              {/* Finding 3 */}
              <div
                onClick={() => navigate('/red-team/findings')}
                className="p-2.5 rounded-lg bg-[#080c14] border border-[#1f293d] hover:border-blue-500/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono text-cyan-400 group-hover:underline">
                    FIND-2026-003
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#1a2d42] text-cyan-400 border border-cyan-500/30 font-mono">
                    MEDIUM
                  </span>
                </div>
                <p className="text-[10px] text-[#c4d1e2] mt-1 line-clamp-2 leading-relaxed">
                  Context window manipulation partially exposed system prompt.
                </p>
                <div className="text-[9px] font-mono text-[#64748b] mt-1.5">
                  09:12:07 • ATK-1FE90
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Activity Timeline + Sandbox Integrity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Execution Activity Timeline (Left 8 cols) */}
        <div className="lg:col-span-8 p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#17212f]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ef4444]" />
              <span className="text-xs font-bold text-white">Execution Activity Timeline</span>
            </div>
            <button
              onClick={() => navigate('/red-team/timeline')}
              className="text-[10px] font-mono text-[#ef4444] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Full Timeline <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Stepper Pipeline */}
          <div className="py-4 px-2">
            <div className="relative flex items-center justify-between">
              {/* Connecting Background Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-red-600 via-amber-500 via-cyan-500 to-emerald-500 -translate-y-1/2 opacity-30 z-0"></div>

              {[
                { label: 'Request Sent', time: '10:24:31', icon: Send, color: '#ef4444', bg: '#250910' },
                { label: 'Gateway Check', time: '10:24:32', icon: Shield, color: '#ef4444', bg: '#250910' },
                { label: 'Defense Filter', time: '10:24:32', icon: Filter, color: '#ef4444', bg: '#250910' },
                { label: 'Model Inference', time: '10:24:33', icon: Cpu, color: '#06b6d4', bg: '#07212b' },
                { label: 'Response Received', time: '10:24:34', icon: MessageSquare, color: '#06b6d4', bg: '#07212b' },
                { label: 'Outcome Classification', time: '10:24:34', icon: CheckCircle2, color: '#10b981', bg: '#06241b' },
                { label: 'Evidence Recorded', time: '10:24:34', icon: Database, color: '#06b6d4', bg: '#07212b' },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center group cursor-pointer">
                    <div
                      style={{ backgroundColor: step.bg, borderColor: `${step.color}60` }}
                      className="w-8 h-8 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
                    >
                      <Icon style={{ color: step.color }} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#d4dde8] mt-2 text-center leading-tight">
                      {step.label}
                    </span>
                    <span className="text-[9px] font-mono text-[#64748b] mt-0.5">
                      {step.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sandbox Integrity (Right 4 cols) */}
        <div className="lg:col-span-4 p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f293d] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#17212f]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-bold text-white">Sandbox Integrity</span>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All Systems Nominal
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Box 1: Gateway */}
            <div className="p-2 rounded-lg bg-[#080c14] border border-[#17212f] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8c9baeff]">
                <span>Gateway</span>
                <span className="text-emerald-400 font-bold">Online</span>
              </div>
              <div className="text-xs font-bold text-white font-mono">v2.6.1</div>
              <div className="pt-0.5">
                <Sparkline color="#10b981" id="sb-1" data={[8, 12, 10, 14, 15, 18, 20]} />
              </div>
            </div>

            {/* Box 2: Isolated Target */}
            <div className="p-2 rounded-lg bg-[#080c14] border border-[#17212f] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8c9baeff]">
                <span>Isolated Target</span>
                <span className="text-cyan-400 font-bold">Running</span>
              </div>
              <div className="text-xs font-bold text-white font-mono">llama3.2</div>
              <div className="pt-0.5">
                <Sparkline color="#06b6d4" id="sb-2" data={[5, 10, 15, 12, 18, 22, 25]} />
              </div>
            </div>

            {/* Box 3: Evidence Ledger */}
            <div className="p-2 rounded-lg bg-[#080c14] border border-[#17212f] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8c9baeff]">
                <span>Evidence Ledger</span>
                <span className="text-emerald-400 font-bold">Synced</span>
              </div>
              <div className="text-xs font-bold text-white font-mono">1,248 records</div>
              <div className="pt-0.5">
                <Sparkline color="#10b981" id="sb-3" data={[20, 25, 35, 40, 50, 65, 80]} />
              </div>
            </div>

            {/* Box 4: Network Isolation */}
            <div className="p-2 rounded-lg bg-[#080c14] border border-[#17212f] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8c9baeff]">
                <span>Network Isolation</span>
                <span className="text-cyan-400 font-bold">Active</span>
              </div>
              <div className="text-xs font-bold text-white font-mono">red_net</div>
              <div className="pt-0.5">
                <Sparkline color="#06b6d4" id="sb-4" data={[10, 10, 10, 10, 10, 10, 10]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
