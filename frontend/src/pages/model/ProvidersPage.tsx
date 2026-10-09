import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertCircle, RefreshCw, Cpu, Server, Shield, ExternalLink } from 'lucide-react';

export const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState([
    {
      id: 'ollama-local',
      name: 'Ollama Local Runtime',
      endpoint: 'http://localhost:11434',
      type: 'Local Sandboxed Container',
      status: 'AVAILABLE',
      activeModel: 'llama3.2:latest',
      models: [
        { name: 'llama3.2:latest', size: '2.0 GB', parameters: '3B', contextWindow: '128k', format: 'GGUF' },
        { name: 'phi3:mini', size: '2.2 GB', parameters: '3.8B', contextWindow: '4k', format: 'GGUF' },
        { name: 'mistral:7b-instruct', size: '4.1 GB', parameters: '7B', contextWindow: '32k', format: 'GGUF' }
      ]
    },
    {
      id: 'mock-llm',
      name: 'Bayora Synthetic Mock Provider',
      endpoint: 'internal://in-memory-engine',
      type: 'Deterministic Sandbox Simulator',
      status: 'AVAILABLE',
      activeModel: 'mock-safety-llm',
      models: [
        { name: 'mock-safety-llm', size: '0 MB', parameters: 'Synthetic', contextWindow: '8k', format: 'Native Python' }
      ]
    }
  ]);

  const [checking, setChecking] = useState(false);

  const handleHealthCheckAll = async () => {
    setChecking(true);
    await new Promise(r => setTimeout(r, 600));
    setChecking(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Providers & Model Catalog</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage target LLM providers, discover local Ollama models, and inspect sandbox isolation parameters.
          </p>
        </div>
        <button
          onClick={handleHealthCheckAll}
          disabled={checking}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          Health Check Providers
        </button>
      </div>

      {/* Providers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">{p.endpoint}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                {p.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider Type:</span>
                <span className="font-semibold text-slate-800">{p.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Default Active Model:</span>
                <span className="font-mono font-bold text-purple-700">{p.activeModel}</span>
              </div>
            </div>

            {/* Model List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discovered Models</div>
              <div className="space-y-1.5">
                {p.models.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 font-mono">{m.name}</span>
                      <span className="text-slate-400 block text-[11px]">{m.parameters} params • {m.contextWindow} context</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white text-slate-600 font-mono text-[10px] rounded border border-slate-200">
                      {m.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
