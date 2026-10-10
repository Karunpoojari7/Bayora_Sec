import React, { useState } from 'react';
import {
  Flame, Play, Pause, Plus, CheckCircle2, AlertTriangle,
  Clock, RotateCcw, Shield, Check, X, FileText, Sparkles
} from 'lucide-react';

interface CampaignsPageProps {
  evaluationId: string;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ evaluationId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [campaigns, setCampaigns] = useState([
    {
      id: 'CMP-001',
      name: 'Llama-3.2 Standard Adversarial Safety Benchmark',
      target: 'llama3.2 (Ollama Isolated)',
      status: 'RUNNING',
      total_tests: 28,
      completed: 24,
      bypasses: 2,
      started_at: '2026-10-10 10:00:00',
      categories: ['Prompt Injection', 'Canary Extraction', 'Delimiter Override']
    },
    {
      id: 'CMP-002',
      name: 'OWASP LLM Top 10 Full Surface Audit',
      target: 'llama3.2 (Ollama Isolated)',
      status: 'READY',
      total_tests: 40,
      completed: 0,
      bypasses: 0,
      started_at: 'Scheduled',
      categories: ['LLM01-LLM10 Comprehensive']
    },
    {
      id: 'CMP-003',
      name: 'Instruction Boundary & Delimiter Fuzzing',
      target: 'llama3.2 (Ollama Isolated)',
      status: 'COMPLETED',
      total_tests: 18,
      completed: 18,
      bypasses: 1,
      started_at: '2026-10-09 16:30:00',
      categories: ['Multi-turn Fuzzing', 'Polyglot Encodings']
    }
  ]);

  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedSuite, setSelectedSuite] = useState('Standard Adversarial Suite');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    const newCamp = {
      id: `CMP-00${campaigns.length + 1}`,
      name: newCampaignName,
      target: 'llama3.2 (Ollama Isolated)',
      status: 'READY',
      total_tests: 25,
      completed: 0,
      bypasses: 0,
      started_at: 'Just now',
      categories: [selectedSuite]
    };
    setCampaigns([newCamp, ...campaigns]);
    setShowCreateModal(false);
    setNewCampaignName('');
    triggerNotify(`Created new campaign ${newCamp.id}: ${newCamp.name}`);
  };

  const toggleCampaignState = (id: string, targetState: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: targetState };
      }
      return c;
    }));
    triggerNotify(`Campaign ${id} transitioned to ${targetState}.`);
  };

  return (
    <div className="space-y-5 font-sans text-[#e2e8f0]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-[#0b0f19] border border-[#ef4444] text-white text-xs font-mono shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#250910] border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.25)]">
              <Flame className="w-4 h-4 text-[#ef4444]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Adversarial Campaign Management
            </h1>
          </div>
          <p className="text-xs text-[#8c9baeff] mt-1 font-normal">
            Orchestrate automated multi-vector adversarial campaigns against authorized evaluation sandboxes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#f87171] hover:to-[#ef4444] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.35)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Campaign List */}
      <div className="space-y-3 font-mono">
        {campaigns.map((cmp) => {
          const isRunning = cmp.status === 'RUNNING';
          const isReady = cmp.status === 'READY';
          const isCompleted = cmp.status === 'COMPLETED';
          const progress = Math.round((cmp.completed / cmp.total_tests) * 100);

          return (
            <div
              key={cmp.id}
              className={`p-4 rounded-xl bg-[#0b0f19] border transition-all shadow-sm space-y-3 ${
                isRunning ? 'border-[#ef4444]/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-[#1f293d]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400">{cmp.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isRunning
                          ? 'bg-[#350a12] text-[#ef4444] border border-[#ef4444]/30 animate-pulse'
                          : isReady
                          ? 'bg-[#0f1f2e] text-blue-400 border border-blue-500/30'
                          : 'bg-[#0b3324] text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {cmp.status}
                    </span>
                    <span className="text-[10px] text-[#64748b]">{cmp.started_at}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{cmp.name}</h3>
                  <div className="text-[11px] text-[#8c9baeff]">
                    Target: <span className="text-cyan-400">{cmp.target}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <button
                      onClick={() => toggleCampaignState(cmp.id, 'PAUSED')}
                      className="px-3 py-1.5 rounded-lg bg-[#080c14] hover:bg-[#191D27] border border-[#1f293d] text-amber-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                  ) : isReady ? (
                    <button
                      onClick={() => toggleCampaignState(cmp.id, 'RUNNING')}
                      className="px-4 py-1.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Execute
                    </button>
                  ) : (
                    <button
                      onClick={() => triggerNotify(`Exporting summary report for ${cmp.id}...`)}
                      className="px-3 py-1.5 rounded-lg bg-[#080c14] hover:bg-[#151d2c] border border-[#1f293d] text-[#8c9baeff] hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Report
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Sub Metrics */}
              <div className="space-y-1.5 pt-2 border-t border-[#17212f]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Execution Progress</span>
                  <span className="text-white font-bold">
                    {cmp.completed} / {cmp.total_tests} vectors ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-[#151d2c] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isRunning ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
          <div className="w-full max-w-lg bg-[#0b0f19] border border-[#ef4444]/60 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.25)] overflow-hidden">
            <div className="p-4 bg-[#080c14] border-b border-[#1f293d] flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ef4444]" /> Create Adversarial Campaign
              </span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#64748b] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#8c9baeff] font-bold">Campaign Identifier / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Llama-3.2 Context Escape Fuzzing Pass"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#080c14] border border-[#17212f] text-white focus:outline-none focus:border-[#ef4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8c9baeff] font-bold">Test Vector Suite</label>
                <select
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#080c14] border border-[#17212f] text-white focus:outline-none focus:border-[#ef4444]"
                >
                  <option>Standard Adversarial Suite (25 Vectors)</option>
                  <option>OWASP LLM01-LLM10 Comprehensive (40 Vectors)</option>
                  <option>Instruction Boundary & Delimiter Fuzzing (18 Vectors)</option>
                  <option>State & Canary Leakage Probes (12 Vectors)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#080c14] border border-[#1f293d] text-[#8c9baeff] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  Initialize Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
