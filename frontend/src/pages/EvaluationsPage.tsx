import React, { useState } from 'react';
import {
  FolderKanban, Plus, Play, Pause, Square, RotateCcw,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Shield
} from 'lucide-react';
import { Evaluation, EvalStatus } from '../types';
import { api } from '../services/api';

interface EvaluationsPageProps {
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
  onRefresh: () => void;
}

export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({
  evaluations,
  selectedEvalId,
  onSelectEval,
  onRefresh,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [targetModel, setTargetModel] = useState('llama3.2');
  const [modelVersion, setModelVersion] = useState('3.2.1-instruct');
  const [description, setDescription] = useState('');
  const [riskProfile, setRiskProfile] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('CRITICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;
    setIsSubmitting(true);
    try {
      const created = await api.createEvaluation({
        project_name: projectName,
        target_model: targetModel,
        model_version: modelVersion,
        description,
        risk_profile: riskProfile,
      });
      setShowCreateModal(false);
      setProjectName('');
      setDescription('');
      onRefresh();
      onSelectEval(created.id);
    } catch (err: any) {
      alert(`Failed to create evaluation: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, action: 'start' | 'pause' | 'resume' | 'terminate' | 'reset') => {
    try {
      if (action === 'start') await api.startEvaluation(id);
      else if (action === 'pause') await api.pauseEvaluation(id);
      else if (action === 'resume') await api.resumeEvaluation(id);
      else if (action === 'terminate') await api.terminateEvaluation(id);
      else if (action === 'reset') await api.resetModelSession(id);
      onRefresh();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">EVALUATION CONTROL CENTER</h2>
          <p className="text-xs text-bayora-textMuted mt-0.5">
            Manage adversarial test environments, target models, and zero-trust session states.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-bayora-accent hover:bg-blue-600 text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>NEW EVALUATION PROJECT</span>
        </button>
      </div>

      {/* Evaluations Table / Card Grid */}
      <div className="grid grid-cols-1 gap-4">
        {evaluations.map((ev) => {
          const isSelected = ev.id === selectedEvalId;

          let statusBadgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
          if (ev.status === 'RUNNING') statusBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          if (ev.status === 'PAUSED') statusBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
          if (ev.status === 'COMPLETED') statusBadgeClass = 'bg-slate-700/50 text-slate-300 border-slate-600';
          if (ev.status === 'QUARANTINED') statusBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

          return (
            <div
              key={ev.id}
              className={`p-5 rounded-2xl bg-bayora-card border transition-all ${
                isSelected ? 'border-bayora-accent shadow-lg shadow-blue-500/10' : 'border-bayora-border hover:border-bayora-borderHighlight'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{ev.id}</span>
                    <span className="text-xs text-bayora-textMuted font-medium">— {ev.project_name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${statusBadgeClass}`}>
                      {ev.status}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold">
                      RISK: {ev.risk_profile}
                    </span>
                  </div>
                  <p className="text-xs text-bayora-textMuted">
                    Target: <span className="text-cyan-400 font-mono font-semibold">{ev.target_model}</span> (v{ev.model_version}) | Created by: <span className="text-slate-300 font-mono">{ev.created_by}</span> | {new Date(ev.created_at).toLocaleDateString()}
                  </p>
                  {ev.description && (
                    <p className="text-xs text-slate-400 pt-1">{ev.description}</p>
                  )}
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectEval(ev.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-bayora-accent text-white'
                        : 'bg-bayora-bg hover:bg-bayora-cardHover border border-bayora-border text-slate-300'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'SELECT'}
                  </button>

                  {ev.status === 'READY' || ev.status === 'PAUSED' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, 'start')}
                      className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30"
                      title="Start / Resume Evaluation"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : ev.status === 'RUNNING' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, 'pause')}
                      className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30"
                      title="Pause Evaluation"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : null}

                  {ev.status === 'RUNNING' || ev.status === 'PAUSED' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, 'terminate')}
                      className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30"
                      title="Terminate Evaluation"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleStatusChange(ev.id, 'reset')}
                    className="p-2 rounded-lg bg-bayora-bg hover:bg-bayora-cardHover border border-bayora-border text-cyan-400"
                    title="Purge / Reset Target Session Context"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-bayora-card border border-bayora-border w-full max-w-lg rounded-2xl p-6 relative shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-bayora-border">
              <h3 className="text-sm font-mono font-bold text-white uppercase">
                CREATE NEW EVALUATION PROJECT
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-bayora-textMuted hover:text-white text-xs font-mono"
              >
                ✕ CANCEL
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">PROJECT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Llama-3.2 Safety Benchmark '26"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">TARGET MODEL</label>
                  <select
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                    className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                  >
                    <option value="llama3.2">llama3.2 (Ollama / Local)</option>
                    <option value="phi3">phi3 (Ollama / Local)</option>
                    <option value="mistral">mistral (Ollama / Local)</option>
                    <option value="mock-llama3-safety-eval">Mock Provider (Air-Gapped / CI)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">MODEL VERSION</label>
                  <input
                    type="text"
                    value={modelVersion}
                    onChange={(e) => setModelVersion(e.target.value)}
                    className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">RISK PROFILE</label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value as any)}
                  className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                >
                  <option value="CRITICAL">CRITICAL (Zero-Trust strict isolation)</option>
                  <option value="HIGH">HIGH (Standard adversarial testing)</option>
                  <option value="MEDIUM">MEDIUM (Functional safety test)</option>
                  <option value="LOW">LOW (Baseline evaluation)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Evaluation scope, adversarial vectors, and compliance requirements..."
                  className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-bayora-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-bayora-bg border border-bayora-border text-xs font-mono text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-bayora-accent hover:bg-blue-600 text-white text-xs font-mono font-semibold"
              >
                {isSubmitting ? 'CREATING...' : 'INITIALIZE EVALUATION'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
