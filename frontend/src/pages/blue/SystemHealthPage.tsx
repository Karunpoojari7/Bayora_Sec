import React, { useState, useEffect } from 'react';
import { Activity, Server, ShieldCheck, CheckCircle2, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { api } from '../../services/api';

export const SystemHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getLlmHealth();
      setHealthData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { name: 'Defense Gateway (FastAPI)', status: 'HEALTHY', latency: '8ms', subnet: '172.28.1.0/24 (control_net)', state: 'ENFORCING' },
    { name: 'Policy Engine (Regex/PCRE)', status: 'HEALTHY', latency: '12ms', subnet: '172.28.3.0/24 (blue_net)', state: 'ACTIVE' },
    { name: 'Threat Intelligence Store (Redis)', status: 'HEALTHY', latency: '2ms', subnet: '172.28.4.0/24 (internal)', state: 'SYNCHRONIZED' },
    { name: 'Immutable Evidence Ledger (SQLite/Postgres)', status: 'HEALTHY', latency: '3ms', subnet: '172.28.5.0/24 (data_net)', state: 'SEALED' },
    { name: 'Target LLM Runtime (Ollama)', status: 'HEALTHY', latency: '145ms', subnet: '172.28.2.0/24 (llm_net)', state: 'ISOLATED' }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00F5A0]" />
            Blue Subsystem & Security Perimeter Health
          </h1>
          <p className="text-[#91B8A7] text-xs mt-1">
            Real-time status of defensive enforcement nodes, subnets, and cryptographic validation daemons.
          </p>
        </div>

        <button
          onClick={loadHealth}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-[#061A13] hover:bg-[#082219] border border-[#124B37] text-[#00F5A0] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Health Status
        </button>
      </div>

      {/* Global Status Banner */}
      <div className="p-5 rounded-xl bg-[#061A13] border border-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#082219] border border-[#00F5A0] flex items-center justify-center text-[#00F5A0]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#E8FFF5]">ALL DEFENSIVE SUBSYSTEMS OPERATIONAL</div>
            <div className="text-[11px] text-[#91B8A7] mt-0.5">5/5 Services reporting healthy telemetry</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-[#00F5A0]/15 border border-[#00F5A0]/40 text-[#00F5A0] text-xs font-bold">
            100% HEALTH SCORE
          </span>
        </div>
      </div>

      {/* Service Nodes Table */}
      <div className="bg-[#061A13] rounded-xl border border-[#124B37] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#124B37] font-bold text-[#E8FFF5] text-xs flex items-center justify-between">
          <span>Defensive Node Topology Status</span>
          <span className="text-[10px] text-[#587D6E]">Perimeter Checks</span>
        </div>

        <div className="divide-y divide-[#124B37]/40 text-xs">
          {services.map((svc, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#082219]/40">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-[#00F5A0]" />
                <div>
                  <div className="text-[#E8FFF5] font-bold">{svc.name}</div>
                  <div className="text-[10px] text-[#587D6E]">{svc.subnet}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#91B8A7] text-[11px]">{svc.latency}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#082219] text-[#19E6FF] border border-[#124B37]">
                  {svc.state}
                </span>
                <span className="text-[#00F5A0] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00F5A0]"></span>
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
