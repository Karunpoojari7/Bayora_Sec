import React, { useState } from 'react';
import { Clock, Radio, Play, ShieldAlert, CheckCircle2, Lock, Filter, Search } from 'lucide-react';

interface ExecutionTimelinePageProps {
  evaluationId: string;
}

export const ExecutionTimelinePage: React.FC<ExecutionTimelinePageProps> = ({ evaluationId }) => {
  const [filter, setFilter] = useState('ALL');

  const events = [
    { seq: 'EVT-0028', time: '10:24:31.102', event: 'PROBE_SUBMITTED', type: 'Prompt Injection', target: 'llama3.2', outcome: 'BLOCKED', policy: 'Instruction_Fence_v2.6', latency: '10ms' },
    { seq: 'EVT-0027', time: '10:23:08.450', event: 'PROBE_SUBMITTED', type: 'Role Confusion', target: 'llama3.2', outcome: 'FILTERED', policy: 'Role_Delimiter_Guard', latency: '14ms' },
    { seq: 'EVT-0026', time: '10:22:45.002', event: 'EVIDENCE_SEALED', type: 'Merkle Leaf Ingest', target: 'ledger', outcome: 'VALID', policy: 'SHA-256 Engine', latency: '3ms' },
    { seq: 'EVT-0025', time: '10:21:02.890', event: 'PROBE_SUBMITTED', type: 'Data Exfiltration', target: 'llama3.2', outcome: 'BLOCKED', policy: 'Data_Redaction_v2.5', latency: '12ms' },
    { seq: 'EVT-0024', time: '10:19:15.304', event: 'PROBE_SUBMITTED', type: 'Polyglot Jailbreak', target: 'llama3.2', outcome: 'BYPASSED', policy: 'None (Model Refusal)', latency: '185ms' },
    { seq: 'EVT-0023', time: '10:17:40.112', event: 'PROBE_SUBMITTED', type: 'Canary Trap Probe', target: 'llama3.2', outcome: 'BLOCKED', policy: 'Canary_Trap_Rule', latency: '9ms' }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF233F]" />
            Adversarial Execution Timeline
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Real-time chronological telemetry trace of attack probe submissions, gateway filtering, and sandbox results.
          </p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#0D1118] rounded-xl border border-[#39202A] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#39202A] font-bold text-[#F4F6FA] text-xs flex items-center justify-between">
          <span>Chronological Trace Events ({events.length})</span>
          <span className="text-[10px] text-[#22D3A6]">Live WebSocket Stream Synchronized</span>
        </div>

        <div className="divide-y divide-[#39202A]/40 text-xs">
          {events.map((ev, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#131720]/40">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#16D9FF]">{ev.seq}</span>
                <div>
                  <div className="text-[#F4F6FA] font-bold flex items-center gap-2">
                    {ev.type}
                    <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                      ev.outcome === 'BLOCKED' ? 'bg-[#FF233F]/15 text-[#FF233F] border border-[#FF233F]/30' :
                      ev.outcome === 'FILTERED' ? 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30' :
                      ev.outcome === 'BYPASSED' ? 'bg-[#FF5268]/20 text-[#FF5268] border border-[#FF5268]/40 font-bold' :
                      'bg-[#22D3A6]/15 text-[#22D3A6]'
                    }`}>
                      {ev.outcome}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#737D90] mt-0.5">
                    Target: {ev.target} · Rule: {ev.policy} · Latency: {ev.latency}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#737D90] font-mono">
                {ev.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
