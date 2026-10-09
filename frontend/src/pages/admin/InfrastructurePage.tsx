import React from 'react';
import { Server, Shield, Network, Lock, CheckCircle2, Cpu, HardDrive, Zap, AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const containers = [
    {
      name: 'bayora-gateway',
      service: 'FastAPI Enforcement Gateway',
      subnet: '172.28.1.0/24 (control_net)',
      capabilities: 'CAP_DROP_ALL + no-new-privileges',
      status: 'HEALTHY',
      port: '8080 (Exposed Host Bridge)',
      color: '#00A3FF'
    },
    {
      name: 'bayora-red-worker',
      service: 'Red Team Offensive Worker',
      subnet: '172.28.0.0/16 (red_net only)',
      capabilities: 'CAP_DROP_ALL + seccomp default',
      status: 'HEALTHY',
      port: 'Internal Socket Only',
      color: '#FF3D59'
    },
    {
      name: 'bayora-blue-guard',
      service: 'Blue Team Policy Engine',
      subnet: '172.28.3.0/24 (blue_net only)',
      capabilities: 'CAP_DROP_ALL + seccomp default',
      status: 'HEALTHY',
      port: 'Internal Socket Only',
      color: '#00D6B5'
    },
    {
      name: 'bayora-target-llm',
      service: 'Target LLM Inference Host',
      subnet: '172.28.2.0/24 (llm_net - No WAN)',
      capabilities: 'CAP_DROP_ALL + internal mTLS',
      status: 'HEALTHY',
      port: '8000 (Internal Target)',
      color: '#A56BFF'
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F4F8FF] tracking-tight">Sandbox Infrastructure & Network Topology</h1>
          <p className="text-[#718BA6] text-xs mt-1">
            Container isolation boundaries, segmented Linux network bridges, and non-root process security controls.
          </p>
        </div>
      </div>

      {/* Network Isolation Diagram Card */}
      <div className="bg-[#071729] p-6 rounded-xl border border-[#12324F] shadow-card space-y-4">
        <h2 className="text-sm font-bold text-[#F4F8FF] uppercase tracking-wider flex items-center gap-2">
          <Network className="w-4 h-4 text-[#00A3FF]" />
          Zero-Trust Docker Bridge Topology
        </h2>

        {/* Visual Architecture Flow */}
        <div className="bg-[#050D1A] border border-[#12324F] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Red Box */}
            <div className="bg-[#1A0A10] border border-[#FF3D59] shadow-[0_0_12px_rgba(255,61,89,0.25)] rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#2E0F17] text-[#FF3D59] mx-auto mb-2 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#FF3D59]">Red Sandbox</div>
              <div className="text-[11px] text-[#A9C2DA] font-mono">(red_net)</div>
              <div className="text-[10px] text-[#718BA6] font-mono mt-1">172.28.0.0/16</div>
            </div>

            {/* Gateway */}
            <div className="bg-[#0A1D31] border border-[#087BDA] shadow-[0_0_12px_rgba(8,123,218,0.25)] rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#0D243B] text-[#00A3FF] mx-auto mb-2 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#00A3FF]">Gateway Mediator</div>
              <div className="text-[11px] text-[#A9C2DA] font-mono">(control_net)</div>
              <div className="text-[10px] text-[#718BA6] font-mono mt-1">172.28.1.0/24</div>
            </div>

            {/* Target LLM */}
            <div className="bg-[#140A24] border border-[#A56BFF] shadow-[0_0_12px_rgba(165,107,255,0.25)] rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#22123B] text-[#A56BFF] mx-auto mb-2 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#A56BFF]">Target LLM Sandbox</div>
              <div className="text-[11px] text-[#A9C2DA] font-mono">(llm_net)</div>
              <div className="text-[10px] text-[#718BA6] font-mono mt-1">172.28.2.0/24</div>
            </div>

            {/* Blue Box */}
            <div className="bg-[#081E20] border border-[#00D6B5] shadow-[0_0_12px_rgba(0,214,181,0.25)] rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#0D2D2E] text-[#00D6B5] mx-auto mb-2 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#00D6B5]">Blue Sandbox</div>
              <div className="text-[11px] text-[#A9C2DA] font-mono">(blue_net)</div>
              <div className="text-[10px] text-[#718BA6] font-mono mt-1">172.28.3.0/24</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#12324F] text-[11px] text-[#718BA6] font-mono flex items-center justify-between">
            <span>Direct routing between Red Team and Blue Team is blocked at the Linux iptables bridge level.</span>
            <span className="text-[#00D6B5] font-bold">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Container Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {containers.map((c, i) => (
          <div key={i} className="bg-[#071729] p-6 rounded-xl border border-[#12324F] shadow-card space-y-3 hover:border-[#087BDA] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D243B] border border-[#12324F] flex items-center justify-center" style={{ color: c.color }}>
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F4F8FF] font-mono text-xs">{c.name}</h3>
                  <p className="text-[11px] text-[#718BA6]">{c.service}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-[#0A2926] text-[#00D6B5] border border-[#00D6B5]/40 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D6B5] animate-pulse"></span>
                {c.status}
              </span>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-[#10283E] text-xs font-mono">
              <div className="text-[#718BA6] flex justify-between">
                <span>Subnet:</span>
                <span className="text-[#EAF4FF]">{c.subnet}</span>
              </div>
              <div className="text-[#718BA6] flex justify-between">
                <span>Hardening:</span>
                <span className="text-[#7FB6E8]">{c.capabilities}</span>
              </div>
              <div className="text-[#718BA6] flex justify-between">
                <span>Port Binding:</span>
                <span className="text-[#A9C2DA]">{c.port}</span>
              </div>
              <div className="text-[#718BA6] flex justify-between">
                <span>Read-Only Root FS:</span>
                <span className="text-[#00D6B5] font-bold">ENFORCED</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
