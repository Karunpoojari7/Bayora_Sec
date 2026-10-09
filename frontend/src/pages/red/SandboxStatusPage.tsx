import React from 'react';
import { Server, Radio, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SandboxStatusPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-[#FF233F]" />
            Red Sandbox & Network Isolation Status
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Diagnostic status of the offensive execution container, isolated bridge interfaces, and resource quotas.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0D1118] border border-[#FF233F] shadow-[0_0_15px_rgba(255,35,63,0.2)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#39202A] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#191D27] border border-[#FF233F] flex items-center justify-center text-[#FF233F]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#737D90]">OFFENSIVE SANDBOX PERIMETER</div>
              <h3 className="text-sm font-bold text-[#F4F6FA]">red_worker.bayora_red_net (172.28.0.0/16)</h3>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#22D3A6]/15 border border-[#22D3A6]/40 text-[#22D3A6] text-xs font-bold">
            STRICT AIRGAP ENFORCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#090B10] rounded-xl border border-[#39202A] space-y-1">
            <span className="text-[#737D90] text-[10px] block font-bold">CONTAINER CAPABILITIES</span>
            <span className="text-[#F4F6FA] font-bold block">CAP_DROP_ALL</span>
            <div className="text-[10px] text-[#22D3A6]">No root privileges permitted</div>
          </div>

          <div className="p-3.5 bg-[#090B10] rounded-xl border border-[#39202A] space-y-1">
            <span className="text-[#737D90] text-[10px] block font-bold">DIRECT BLUE_NET ROUTING</span>
            <span className="text-[#FF233F] font-bold block">PROHIBITED (Drop)</span>
            <div className="text-[10px] text-[#737D90]">Mediated solely via Gateway API</div>
          </div>

          <div className="p-3.5 bg-[#090B10] rounded-xl border border-[#39202A] space-y-1">
            <span className="text-[#737D90] text-[10px] block font-bold">DATABASE ACCESS</span>
            <span className="text-[#FF233F] font-bold block">ISOLATED (data_net)</span>
            <div className="text-[10px] text-[#737D90]">No direct connection to Postgres</div>
          </div>
        </div>
      </div>
    </div>
  );
};
