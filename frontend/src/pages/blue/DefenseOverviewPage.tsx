import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Lock, Activity,
  RefreshCw, CheckCircle2, AlertTriangle, Radio, Server,
  Sliders, Cpu, HardDrive, Zap, Eye, ArrowRight, Ban,
  Database, Network
} from 'lucide-react';
import { api } from '../../services/api';
import { BlueViewData } from '../../types';

interface DefenseOverviewPageProps {
  evaluationId: string;
}

export const DefenseOverviewPage: React.FC<DefenseOverviewPageProps> = ({ evaluationId }) => {
  const [blueData, setBlueData] = useState<BlueViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    loadTelemetry();
  }, [evaluationId]);

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const data = await api.getBlueView(evaluationId);
      setBlueData(data);
    } catch (e) {
      console.error('Failed loading blue view telemetry', e);
    } finally {
      setLoading(false);
    }
  };

  const attacks = blueData?.sanitized_attacks || [];
  const activeDefenses = blueData?.active_defenses || [
    { name: 'Prompt Injection Filter', version: 'v2.6', status: 'ACTIVE', desc: 'Blocks system prompt extraction' },
    { name: 'Jailbreak Detection', version: 'v2.0', status: 'ACTIVE', desc: 'Detects jailbreak attempts and DAN' },
    { name: 'Context Manipulation Guard', version: 'v2.0', status: 'ACTIVE', desc: 'Prevents context window manipulation' },
    { name: 'Sensitive Data Redaction', version: 'v2.5', status: 'ACTIVE', desc: 'Redacts API keys and sensitive data' },
    { name: 'Output Content Filter', version: 'v2.2', status: 'ACTIVE', desc: 'Filters harmful and unsafe outputs' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] font-mono tracking-tight flex items-center gap-2.5">
            Blue Team Defense Center
          </h1>
          <p className="text-xs text-[#91B8A7] mt-1 font-mono">
            Real-time threat detection, policy enforcement, and adversarial containment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#061A13] border border-[#124B37] text-xs font-mono text-[#91B8A7] flex items-center gap-2">
            <span className="text-[#587D6E]">Last Update:</span>
            <span className="text-[#E8FFF5] font-bold">10:24:31 AM</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#061A13] border border-[#124B37] text-xs font-mono text-[#00F5A0] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping"></span>
            <span>Live Telemetry Connected</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-[#082219] border border-[#00F5A0] text-xs font-mono flex items-center gap-2 shadow-[0_0_10px_rgba(0,245,160,0.2)]">
            <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
            <div>
              <div className="text-[10px] text-[#587D6E] font-bold uppercase leading-none">PROTECTION STATUS</div>
              <div className="text-[#00F5A0] font-bold leading-none mt-0.5">ACTIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: 5 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Metric 1: Threats Detected */}
        <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#91B8A7] font-semibold">THREATS DETECTED</span>
            <div className="w-6 h-6 rounded-lg bg-[#082219] border border-[#124B37] flex items-center justify-center text-[#00F5A0]">
              <Radio className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-mono font-black text-[#E8FFF5] mt-1.5">47</div>
          <div className="text-[10px] font-mono text-[#00F5A0] mt-1 flex items-center gap-1 font-semibold">
            <span>+12%</span>
            <span className="text-[#587D6E]">from last hour</span>
          </div>
        </div>

        {/* Metric 2: Requests Blocked */}
        <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#91B8A7] font-semibold">REQUESTS BLOCKED</span>
            <div className="w-6 h-6 rounded-lg bg-[#082219] border border-[#124B37] flex items-center justify-center text-[#00F5A0]">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-mono font-black text-[#E8FFF5] mt-1.5">42</div>
          <div className="text-[10px] font-mono text-[#91B8A7] mt-1 font-semibold">
            <span className="text-[#00F5A0]">89.4%</span> block rate
          </div>
        </div>

        {/* Metric 3: Active Guardrails */}
        <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#91B8A7] font-semibold">ACTIVE GUARDRAILS</span>
            <div className="w-6 h-6 rounded-lg bg-[#082219] border border-[#124B37] flex items-center justify-center text-[#00F5A0]">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-mono font-black text-[#E8FFF5] mt-1.5">5</div>
          <div className="text-[10px] font-mono text-[#587D6E] mt-1 font-semibold">
            All policies enforcing
          </div>
        </div>

        {/* Metric 4: Containment Rate */}
        <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#91B8A7] font-semibold block">CONTAINMENT RATE</span>
            <div className="text-2xl font-mono font-black text-[#E8FFF5] mt-1">99.7%</div>
            <div className="text-[10px] font-mono text-[#587D6E] mt-0.5">All policies defending</div>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="18" stroke="#082219" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#00F5A0"
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="0.3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F5A0] absolute shadow-[0_0_6px_#00F5A0]"></div>
          </div>
        </div>

        {/* Metric 5: System Health */}
        <div className="p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#91B8A7] font-semibold block">SYSTEM HEALTH</span>
            <div className="text-2xl font-mono font-black text-[#00F5A0] mt-1">100%</div>
            <div className="text-[10px] font-mono text-[#587D6E] mt-0.5">All services healthy</div>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="18" stroke="#082219" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#00F5A0"
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F5A0] absolute shadow-[0_0_6px_#00F5A0]"></div>
          </div>
        </div>
      </div>

      {/* Row 2: Components (col-3) + Topology (col-6) + Active Defenses (col-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* System Components (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
              <span className="text-xs font-mono font-bold text-[#E8FFF5]">System Components</span>
              <button className="text-[10px] font-mono text-[#00F5A0] hover:underline cursor-pointer">View All →</button>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              {[
                { name: 'Defense Gateway', latency: '8ms', status: 'Healthy' },
                { name: 'Policy Engine', latency: '12ms', status: 'Healthy' },
                { name: 'Threat Analyzer', latency: '15ms', status: 'Healthy' },
                { name: 'Evidence Guard', latency: '10ms', status: 'Healthy' },
                { name: 'Response Orchestrator', latency: '9ms', status: 'Healthy' },
                { name: 'Quarantine Service', latency: '11ms', status: 'Healthy' }
              ].map((svc, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#124B37]/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-[#00F5A0]" />
                    <span className="text-[#E8FFF5] text-[11px]">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#587D6E]">{svc.latency}</span>
                    <span className="text-[10px] font-bold text-[#00F5A0] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0]"></span>
                      {svc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defense Topology (6 cols) */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
              <span className="text-xs font-mono font-bold text-[#E8FFF5]">Defense Topology</span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#00F5A0]">
                  <span className="w-2 h-0.5 bg-[#00F5A0]"></span> Valid Route
                </span>
                <span className="flex items-center gap-1 text-[#FF4568]">
                  <span className="w-2 h-0.5 bg-[#FF4568] border-b border-dashed"></span> Blocked Route
                </span>
              </div>
            </div>

            {/* Topology Interactive Flow */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-3 items-center text-center">
                {/* Red Team Node */}
                <div className="p-3 rounded-xl bg-[#1A0A0E] border border-[#FF4568]/50 shadow-[0_0_12px_rgba(255,69,104,0.2)]">
                  <div className="w-7 h-7 rounded-lg bg-[#FF4568]/15 text-[#FF4568] mx-auto flex items-center justify-center mb-1">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold text-[#FF4568]">Red Team</div>
                  <div className="text-[9px] font-mono text-[#587D6E] mt-0.5">172.28.0.0/16</div>
                </div>

                {/* Defense Gateway Node */}
                <div className="p-3 rounded-xl bg-[#082219] border border-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.3)]">
                  <div className="w-7 h-7 rounded-lg bg-[#00F5A0]/20 text-[#00F5A0] mx-auto flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold text-[#00F5A0]">Defense Gateway</div>
                  <div className="text-[9px] font-mono text-[#91B8A7] mt-0.5">172.28.1.0/24</div>
                </div>

                {/* Target LLM Node */}
                <div className="p-3 rounded-xl bg-[#170B24] border border-[#A56BFF]/50 shadow-[0_0_12px_rgba(165,107,255,0.2)]">
                  <div className="w-7 h-7 rounded-lg bg-[#A56BFF]/15 text-[#A56BFF] mx-auto flex items-center justify-center mb-1">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold text-[#A56BFF]">Target LLM</div>
                  <div className="text-[9px] font-mono text-[#587D6E] mt-0.5">172.28.2.0/24</div>
                </div>
              </div>

              {/* Secondary Layer Nodes */}
              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#124B37]/60">
                <div className="p-2.5 rounded-lg bg-[#051811] border border-[#124B37] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-[#19E6FF]" />
                    <div>
                      <div className="text-[#E8FFF5] text-[11px] font-bold">Threat Intel (Redis)</div>
                      <div className="text-[9px] text-[#587D6E]">172.28.4.0/24</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00F5A0] font-bold">Connected</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#051811] border border-[#124B37] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#00F5A0]" />
                    <div>
                      <div className="text-[#E8FFF5] text-[11px] font-bold">Evidence DB</div>
                      <div className="text-[9px] text-[#587D6E]">172.28.5.0/24</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00F5A0] font-bold">Immutable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Defenses (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
              <span className="text-xs font-mono font-bold text-[#E8FFF5]">Active Defenses</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#082219] text-[#00F5A0] border border-[#124B37] font-bold">
                5/5 ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {activeDefenses.map((d: any, idx: number) => (
                <div key={idx} className="p-2 rounded-lg bg-[#051811] border border-[#124B37]/60 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="text-[#E8FFF5] text-[11px] font-bold truncate">{d.name}</div>
                    <div className="text-[9px] text-[#587D6E]">{d.version || 'v2.0'}</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00F5A0] shadow-[0_0_6px_#00F5A0] shrink-0"></span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#124B37] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#587D6E]">AUTOMATED RESPONSE</span>
            <span className="text-[#00F5A0] font-bold">Enabled (Sub-1s)</span>
          </div>
        </div>
      </div>

      {/* Row 3: Live Alerts (5 cols) + Resource Usage (4 cols) + Recent Actions (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Security Alerts (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card">
          <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
            <span className="text-xs font-mono font-bold text-[#E8FFF5]">Live Security Alerts</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#051811] border border-[#124B37] text-[10px] font-mono text-[#E8FFF5] rounded px-2 py-1 focus:outline-none"
            >
              <option value="ALL">All Severity</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="text-[10px] text-[#587D6E] uppercase border-b border-[#124B37]">
                <tr>
                  <th className="pb-1.5">SEVERITY</th>
                  <th className="pb-1.5">TIME</th>
                  <th className="pb-1.5">THREAT TYPE</th>
                  <th className="pb-1.5">TARGET</th>
                  <th className="pb-1.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#124B37]/40">
                {[
                  { sev: 'High', time: '10:24:31', type: 'Prompt Injection', target: 'llama3.2', action: 'Blocked', color: 'text-[#FF4568]' },
                  { sev: 'Medium', time: '10:22:15', type: 'Data Exfiltration', target: 'llama3.2', action: 'Sanitized', color: 'text-[#FFB547]' },
                  { sev: 'Medium', time: '10:21:02', type: 'Context Manipulation', target: 'llama3.2', action: 'Flagged', color: 'text-[#FFB547]' },
                  { sev: 'Low', time: '10:19:33', type: 'Policy Bypass Attempt', target: 'llama3.2', action: 'Blocked', color: 'text-[#54B8FF]' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#082219]/50">
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        row.sev === 'High' ? 'bg-[#FF4568]/15 text-[#FF4568] border border-[#FF4568]/30' :
                        row.sev === 'Medium' ? 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30' :
                        'bg-[#54B8FF]/15 text-[#54B8FF] border border-[#54B8FF]/30'
                      }`}>
                        {row.sev}
                      </span>
                    </td>
                    <td className="py-2 text-[#91B8A7]">{row.time}</td>
                    <td className="py-2 text-[#E8FFF5] font-semibold">{row.type}</td>
                    <td className="py-2 text-[#00F5A0]">{row.target}</td>
                    <td className="py-2 text-right font-bold text-[#00F5A0]">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource Usage (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
              <span className="text-xs font-mono font-bold text-[#E8FFF5]">Resource Usage</span>
              <span className="text-[10px] font-mono text-[#587D6E]">Last 1 Hour</span>
            </div>

            {/* 3 Circular Gauges */}
            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="24" stroke="#082219" strokeWidth="4" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      stroke="#00F5A0"
                      strokeWidth="4"
                      strokeDasharray="150"
                      strokeDashoffset="108"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute text-xs font-mono font-bold text-[#E8FFF5]">28%</div>
                </div>
                <div className="text-[10px] font-mono text-[#91B8A7] mt-1 font-semibold">CPU</div>
              </div>

              <div>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="24" stroke="#082219" strokeWidth="4" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      stroke="#19E6FF"
                      strokeWidth="4"
                      strokeDasharray="150"
                      strokeDashoffset="81"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute text-xs font-mono font-bold text-[#E8FFF5]">46%</div>
                </div>
                <div className="text-[10px] font-mono text-[#91B8A7] mt-1 font-semibold">Memory</div>
              </div>

              <div>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="24" stroke="#082219" strokeWidth="4" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      stroke="#FFB547"
                      strokeWidth="4"
                      strokeDasharray="150"
                      strokeDashoffset="93"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute text-xs font-mono font-bold text-[#E8FFF5]">38%</div>
                </div>
                <div className="text-[10px] font-mono text-[#91B8A7] mt-1 font-semibold">Disk</div>
              </div>
            </div>
          </div>

          {/* Rate Limit Bar */}
          <div className="pt-2 border-t border-[#124B37] text-xs font-mono">
            <div className="flex justify-between text-[10px] text-[#91B8A7] mb-1">
              <span>Defense Rate Limit: 120 req/min</span>
              <span className="text-[#00F5A0] font-bold">42 / 120 (35%)</span>
            </div>
            <div className="w-full bg-[#082219] h-2 rounded-full overflow-hidden">
              <div className="bg-[#00F5A0] h-full rounded-full w-[35%] shadow-[0_0_8px_#00F5A0]"></div>
            </div>
          </div>
        </div>

        {/* Recent Defense Actions (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-[#061A13] border border-[#124B37] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5 mb-3">
              <span className="text-xs font-mono font-bold text-[#E8FFF5]">Recent Defense Actions</span>
              <button className="text-[10px] font-mono text-[#00F5A0] hover:underline cursor-pointer">View Timeline →</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {[
                { time: '10:24:31', title: 'Injection Blocked', desc: 'Adversarial prompt identified and blocked at gateway.', icon: Ban, color: 'text-[#FF4568]' },
                { time: '10:23:08', title: 'Context Sanitized', desc: 'Harmful context removed from model input.', icon: ShieldCheck, color: 'text-[#00F5A0]' },
                { time: '10:22:45', title: 'Evidence Logged', desc: 'Attack attempt recorded in immutable ledger.', icon: Lock, color: 'text-[#19E6FF]' },
                { time: '10:21:02', title: 'Session Contained', desc: 'Suspicious session isolated in sandbox.', icon: Activity, color: 'text-[#FFB547]' }
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`p-1 rounded bg-[#082219] border border-[#124B37] ${act.color} shrink-0 mt-0.5`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#587D6E]">{act.time}</span>
                        <span className="text-[11px] font-bold text-[#E8FFF5]">{act.title}</span>
                      </div>
                      <p className="text-[10px] text-[#91B8A7] mt-0.5 leading-snug">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
