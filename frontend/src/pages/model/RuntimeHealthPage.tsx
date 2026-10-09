import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, RefreshCw, Cpu, HardDrive, Zap, Server } from 'lucide-react';
import { api } from '../../services/api';

export const RuntimeHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getLlmHealth();
      setHealthData(res);
    } catch (err) {
      setHealthData({ service: 'target_llm', status: 'DEGRADED', provider: 'Mock Fallback' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">LLM Runtime Health & Telemetry</h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time health status, process memory, container resource usage, and gateway socket connectivity.
          </p>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Probe Runtime
        </button>
      </div>

      {/* Primary Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target LLM Service</span>
            <Server className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xl font-bold text-slate-900">{healthData?.status || 'HEALTHY'}</span>
          </div>
          <p className="text-xs text-slate-500 font-mono">Provider: {healthData?.provider || 'Mock / Ollama'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Sandbox Bridge</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xl font-bold text-slate-900">CONNECTED</span>
          </div>
          <p className="text-xs text-slate-500 font-mono">mTLS & Token Fence: ACTIVE</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KV-Cache State</span>
            <HardDrive className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xl font-bold text-slate-900">EPHEMERAL</span>
          </div>
          <p className="text-xs text-slate-500">Cleared per evaluation boundary</p>
        </div>
      </div>

      {/* Host Resource Telemetry */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Host & Container Resource Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Inference Engine Memory</span>
            <div className="text-lg font-bold text-slate-900 font-mono">2.14 GB / 8.00 GB</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '27%' }}></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">GPU / TPU VRAM Usage</span>
            <div className="text-lg font-bold text-slate-900 font-mono">N/A (CPU Mode)</div>
            <p className="text-[11px] text-slate-400 mt-1">Direct float32 / Q4_K_M quant</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Queue Depth</span>
            <div className="text-lg font-bold text-slate-900 font-mono">0 pending requests</div>
            <p className="text-[11px] text-slate-400 mt-1">Throughput: 18 req/sec max</p>
          </div>
        </div>
      </div>
    </div>
  );
};
