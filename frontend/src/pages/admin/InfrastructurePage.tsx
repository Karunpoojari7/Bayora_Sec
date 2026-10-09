import React from 'react';
import { Server, Shield, Network, Lock, CheckCircle2, Cpu, HardDrive, Zap } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const containers = [
    {
      name: 'bayora-gateway',
      service: 'FastAPI Enforcement Gateway',
      subnet: '172.28.0.2 (red_net, blue_net, target_net)',
      capabilities: 'CAP_DROP_ALL + no-new-privileges',
      status: 'HEALTHY',
      readOnlyRoot: true
    },
    {
      name: 'bayora-red-worker',
      service: 'Red Team Offensive Worker',
      subnet: '172.28.1.5 (red_net only)',
      capabilities: 'CAP_DROP_ALL + seccomp default',
      status: 'HEALTHY',
      readOnlyRoot: true
    },
    {
      name: 'bayora-blue-guard',
      service: 'Blue Team Policy Engine',
      subnet: '172.28.2.8 (blue_net only)',
      capabilities: 'CAP_DROP_ALL + seccomp default',
      status: 'HEALTHY',
      readOnlyRoot: true
    },
    {
      name: 'bayora-target-llm',
      service: 'Target LLM Inference Host',
      subnet: '172.28.3.10 (target_net only - No WAN)',
      capabilities: 'CAP_DROP_ALL + internal mTLS',
      status: 'HEALTHY',
      readOnlyRoot: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sandbox Infrastructure & Topology</h2>
          <p className="text-slate-500 text-sm mt-1">
            Container isolation boundaries, segmented Linux network bridges, and non-root process security controls.
          </p>
        </div>
      </div>

      {/* Network Isolation Diagram Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          Zero-Trust Docker Bridge Topology
        </h3>

        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed space-y-2 border border-slate-800">
          <div className="text-emerald-400 font-bold">[RED_NET Subnet] --------&gt; [GATEWAY (Strict Mediator)] &lt;-------- [BLUE_NET Subnet]</div>
          <div className="text-purple-400 font-bold">                                     | (mTLS Isolated Bridge)</div>
          <div className="text-purple-400 font-bold">                                     v</div>
          <div className="text-purple-400 font-bold">                           [TARGET_NET (No WAN Access)]</div>
          <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
            * Direct peer-to-peer container routing between Red Team and Blue Team is blocked at the Linux iptables / Docker bridge level. All interactions are forced through the cryptographically-audited Gateway API.
          </div>
        </div>
      </div>

      {/* Container Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {containers.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 font-mono text-sm">{c.name}</h4>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {c.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">{c.service}</p>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="text-slate-500">Subnet: <span className="text-slate-800">{c.subnet}</span></div>
              <div className="text-slate-500">Hardening: <span className="text-slate-800">{c.capabilities}</span></div>
              <div className="text-slate-500">Read-Only Root FS: <span className="text-emerald-700 font-bold">ENFORCED</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
