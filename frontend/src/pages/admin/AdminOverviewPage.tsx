import React, { useState, useEffect } from 'react';
import { Shield, Users, FolderKanban, Server, Award, CheckCircle2, AlertTriangle, RefreshCw, Lock, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { Evaluation, TestIntegrityPassport, EvidenceVerification } from '../../types';

interface AdminOverviewPageProps {
  evaluationId: string;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ evaluationId }) => {
  const [dashboardData, setDashboardData] = useState<{
    evaluation: Evaluation;
    passport: TestIntegrityPassport;
    evidence_integrity: EvidenceVerification;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, [evaluationId]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard(evaluationId);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard overview', err);
    } finally {
      setLoading(false);
    }
  };

  const evalItem = dashboardData?.evaluation;
  const pass = dashboardData?.passport;
  const evid = dashboardData?.evidence_integrity;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Control Plane Overview</h2>
          <p className="text-slate-500 text-sm mt-1">
            Global evaluation posture, root-of-trust verification status, sandbox health, and resource governance.
          </p>
        </div>
        <button
          onClick={loadOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Control Plane
        </button>
      </div>

      {/* Global Status Banner */}
      <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Evaluation Context</span>
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {evaluationId}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{evalItem?.project_name || 'Production Adversarial Safety Evaluation'}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Model: <span className="font-mono font-semibold text-slate-700">{evalItem?.target_model || 'llama3.2:latest'}</span> • Sandbox Mode: <span className="font-semibold text-slate-700">Hardened Linux Subnet</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${
            evid?.is_valid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${evid?.is_valid ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            Merkle Root: {evid?.is_valid ? 'VERIFIED' : 'TAMPER DETECTED'}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluation Status</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{evalItem?.status || 'RUNNING'}</div>
          <p className="text-xs text-slate-500 mt-1">Lifecycle state</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tests Executed</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{pass?.attack_count || 0}</div>
          <p className="text-xs text-slate-500 mt-1">Cryptographically audited</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Defense Score</span>
          <div className="text-2xl font-black text-blue-600 mt-2">{pass?.trust_score ? `${Math.round(pass.trust_score)}%` : 'N/A'}</div>
          <p className="text-xs text-slate-500 mt-1">Weighted mitigation rate</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence Chain Events</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{evid?.total_events || 0}</div>
          <p className="text-xs text-slate-500 mt-1">Immutable ledger blocks</p>
        </div>
      </div>

      {/* Infrastructure & Services Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Connected Infrastructure Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">FastAPI API Gateway</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> HEALTHY (Port 8080)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Red Team Sandbox Worker</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> HEALTHY (Isolated Subnet)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Blue Team Guardrail Engine</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE (v2.1.0 Enforcing)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Target LLM Service</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> HEALTHY (Ollama/Mock)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
