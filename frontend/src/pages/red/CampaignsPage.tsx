import React, { useState } from 'react';
import { Flame, Play, Pause, Plus, CheckCircle2, AlertTriangle, Clock, RotateCcw, Shield } from 'lucide-react';

interface CampaignsPageProps {
  evaluationId: string;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ evaluationId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: 'CMP-001',
      name: 'Llama-3.2 Standard Adversarial Safety Benchmark',
      target: 'llama3.2 (Ollama Isolated)',
      status: 'RUNNING',
      total_tests: 28,
      completed: 24,
      bypasses: 2,
      started_at: '2024-01-26 10:00:00',
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
      started_at: '2024-01-25 16:30:00',
      categories: ['Multi-turn Fuzzing', 'Polyglot Encodings']
    }
  ]);

  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedSuite, setSelectedSuite] = useState('Standard Adversarial Suite');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF233F]" />
            Adversarial Campaign Management
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Orchestrate automated multi-vector adversarial campaigns against authorized evaluation sandboxes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-[#FF233F] hover:bg-[#D71935] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,35,63,0.4)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map((cmp) => {
          const isRunning = cmp.status === 'RUNNING';
          const isReady = cmp.status === 'READY';
          const isCompleted = cmp.status === 'COMPLETED';
          const progress = Math.round((cmp.completed / cmp.total_tests) * 100);

          return (
            <div
              key={cmp.id}
              className={`p-5 rounded-xl bg-[#0D1118] border transition-all shadow-card space-y-4 ${
                isRunning ? 'border-[#FF233F] shadow-[0_0_15px_rgba(255,35,63,0.2)]' : 'border-[#39202A]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#16D9FF]">{cmp.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isRunning ? 'bg-[#FF233F]/15 text-[#FF233F] border border-[#FF233F]/30 animate-pulse' :
                      isReady ? 'bg-[#16D9FF]/15 text-[#16D9FF] border border-[#16D9FF]/30' :
                      'bg-[#22D3A6]/15 text-[#22D3A6] border border-[#22D3A6]/30'
                    }`}>
                      {cmp.status}
                    </span>
                    <span className="text-[10px] text-[#737D90]">{cmp.started_at}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F4F6FA]">{cmp.name}</h3>
                  <div className="text-[11px] text-[#A1A8B7]">Target: <span className="text-[#16D9FF]">{cmp.target}</span></div>
                </div>

                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <button
                      onClick={() => alert(`Paused campaign ${cmp.id}. Gateway probe queue halted.`)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#131720] hover:bg-[#191D27] border border-[#39202A] text-[#FFB547] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5 inline mr-1" /> Pause
                    </button>
                  ) : isReady ? (
                    <button
                      onClick={() => alert(`Launched campaign ${cmp.id}. Probes dispatched to red_net sandbox.`)}
                      className="px-4 py-1.5 rounded-lg bg-[#FF233F] hover:bg-[#D71935] text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,35,63,0.3)] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 inline mr-1" /> Execute
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Exporting campaign summary report for ${cmp.id}...`)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#131720] hover:bg-[#191D27] border border-[#39202A] text-[#A1A8B7] hover:text-[#F4F6FA] text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Sub Metrics */}
              <div className="space-y-2 pt-2 border-t border-[#39202A]/60">
                <div className="flex justify-between text-xs">
                  <span className="text-[#737D90]">Execution Progress</span>
                  <span className="text-[#F4F6FA] font-bold">{cmp.completed} / {cmp.total_tests} vectors ({progress}%)</span>
                </div>
                <div className="w-full bg-[#131720] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isRunning ? 'bg-[#FF233F] shadow-[0_0_8px_#FF233F]' : 'bg-[#22D3A6]'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A1A8B7] pt-1">
                  <div>Categories: <span className="text-[#F4F6FA]">{cmp.categories.join(', ')}</span></div>
                  <div>Confirmed Bypasses: <span className="text-[#FF5268] font-bold">{cmp.bypasses}</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#050607]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1118] border border-[#FF233F] rounded-2xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(255,35,63,0.3)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#39202A]">
              <h3 className="text-base font-bold text-[#F4F6FA] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF233F]" />
                Configure New Campaign
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#737D90] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#737D90] uppercase block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Llama-3.2 Context Boundary Audit"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full bg-[#090B10] border border-[#39202A] rounded-lg p-2.5 text-xs text-[#F4F6FA] focus:outline-none focus:border-[#FF233F]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#737D90] uppercase block mb-1">Test Suite Preset</label>
                <select
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="w-full bg-[#090B10] border border-[#39202A] rounded-lg p-2.5 text-xs text-[#F4F6FA] focus:outline-none focus:border-[#FF233F]"
                >
                  <option value="Standard Adversarial Suite">Standard Adversarial Suite (25 cases)</option>
                  <option value="OWASP LLM Top 10 Suite">OWASP LLM Top 10 Suite (40 cases)</option>
                  <option value="Canary & Secret Leakage Suite">Canary & Secret Leakage Suite (15 cases)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 text-xs text-[#A1A8B7] bg-[#090B10] border border-[#39202A] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF233F] hover:bg-[#D71935] rounded-lg shadow-[0_0_12px_rgba(255,35,63,0.4)]"
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
