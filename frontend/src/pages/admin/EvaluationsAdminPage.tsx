import React, { useState } from 'react';
import {
  FolderKanban, Plus, Play, Pause, Square, RotateCcw,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Shield, Cpu, X
} from 'lucide-react';
import { Evaluation, EvalStatus } from '../../types';
import { api } from '../../services/api';

interface EvaluationsAdminPageProps {
  evaluations: Evaluation[];
  selectedEvalId: string;
  onSelectEval: (id: string) => void;
  onRefresh: () => void;
}

export const EvaluationsAdminPage: React.FC<EvaluationsAdminPageProps> = ({
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

  const getStatusBadge = (status: EvalStatus) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            RUNNING
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            PAUSED
          </span>
        );
      case 'COMPLETED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
            {status || 'INITIALIZING'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluations Management</h2>
          <p className="text-slate-500 text-sm mt-1">
            Create, configure, monitor, and enforce lifecycle limits on adversarial AI safety testing environments.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Evaluation
        </button>
      </div>

      {/* Evaluations List */}
      <div className="grid grid-cols-1 gap-4">
        {evaluations.map((ev) => {
          const isSelected = ev.id === selectedEvalId;
          return (
            <div
              key={ev.id}
              className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-base">{ev.id}</span>
                    {getStatusBadge(ev.status)}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      ev.risk_profile === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      ev.risk_profile === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ev.risk_profile} RISK
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{ev.project_name}</h3>
                  <p className="text-xs text-slate-500">{ev.description || 'Production adversarial safety evaluation suite'}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-mono">
                    <span>Target: <strong className="text-slate-900">{ev.target_model}:{ev.model_version}</strong></span>
                    <span>Created: {new Date(ev.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ev.status === 'READY' || ev.status === 'DRAFT' || ev.status === 'PAUSED' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, ev.status === 'PAUSED' ? 'resume' : 'start')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {ev.status === 'PAUSED' ? 'Resume' : 'Start'}
                    </button>
                  ) : null}

                  {ev.status === 'RUNNING' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, 'pause')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </button>
                  ) : null}

                  {ev.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => handleStatusChange(ev.id, 'terminate')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      <Square className="w-3.5 h-3.5" />
                      Terminate
                    </button>
                  ) : null}

                  <button
                    onClick={() => onSelectEval(ev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Scope' : 'Select Scope'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Evaluation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                Initialize New Evaluation Scope
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Evaluation Scope Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 FinTech LLM Robustness Audit"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Target Model
                  </label>
                  <input
                    type="text"
                    required
                    value={targetModel}
                    onChange={e => setTargetModel(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Model Version / Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={modelVersion}
                    onChange={e => setModelVersion(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Risk Profile Classification
                </label>
                <select
                  value={riskProfile}
                  onChange={e => setRiskProfile(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="CRITICAL">CRITICAL (Financial / Infrastructure LLM)</option>
                  <option value="HIGH">HIGH (Enterprise Internal Assistant)</option>
                  <option value="MEDIUM">MEDIUM (Public Conversational Bot)</option>
                  <option value="LOW">LOW (Experimental R&D)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Scope Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Testing objectives, threat model assumptions, and compliance requirements..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Provision Evaluation Scope'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
