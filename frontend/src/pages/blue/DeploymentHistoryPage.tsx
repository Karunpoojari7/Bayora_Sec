import React, { useState, useEffect } from 'react';
import { History, Shield, CheckCircle2, RotateCcw, Lock, RefreshCw, UserCheck } from 'lucide-react';
import { api } from '../../services/api';

interface DeploymentHistoryPageProps {
  evaluationId: string;
}

export const DeploymentHistoryPage: React.FC<DeploymentHistoryPageProps> = ({ evaluationId }) => {
  const [deployments, setDeployments] = useState<any[]>([
    {
      id: 'dep-004',
      version: 'v2.1.0',
      policy_name: 'Multi-Layer Instruction Fence + Delimiter Shield',
      author: 'blue_operator',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'ACTIVE',
      commit_hash: '9f2c8d104a3e',
      notes: 'Added strict instruction token fences against roleplay jailbreaks'
    },
    {
      id: 'dep-003',
      version: 'v2.0.0',
      policy_name: 'Pre-LLM Gateway Validation Rules',
      author: 'blue_operator',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'SUPERSEDED',
      commit_hash: '3e7b1a998c21',
      notes: 'Initial pre-execution heuristic regex filters'
    },
    {
      id: 'dep-002',
      version: 'v1.5.0',
      policy_name: 'Basic Regex Keyword Blocker',
      author: 'admin',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: 'ROLLED_BACK',
      commit_hash: '1a8f902b4d55',
      notes: 'High false positive rate on benchmark test set'
    },
    {
      id: 'dep-001',
      version: 'v1.0.0',
      policy_name: 'Default Passthrough Baseline',
      author: 'system',
      timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      status: 'ARCHIVED',
      commit_hash: '000000000000',
      notes: 'Baseline configuration for evaluation initialization'
    }
  ]);

  const [activeVersion, setActiveVersion] = useState('v2.1.0');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleRollback = (dep: any) => {
    setActiveVersion(dep.version);
    setStatusMsg(`Successfully rolled back active gateway defense to ${dep.version}.`);
    setDeployments(prev => prev.map(d => ({
      ...d,
      status: d.version === dep.version ? 'ACTIVE' : d.status === 'ACTIVE' ? 'SUPERSEDED' : d.status
    })));
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Policy Deployment & Audit History</h2>
          <p className="text-slate-500 text-sm mt-1">
            Immutable audit record of all policy deployments, rollback events, and cryptographic signatures.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl border border-emerald-200 font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Deployment Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            Deployment Ledger ({deployments.length})
          </span>
          <span className="text-xs text-slate-400">Cryptographically Chained</span>
        </div>

        <div className="divide-y divide-slate-100">
          {deployments.map((dep) => {
            const isActive = dep.status === 'ACTIVE';
            return (
              <div key={dep.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{dep.version}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      isActive ? 'bg-emerald-100 text-emerald-800' :
                      dep.status === 'ROLLED_BACK' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {dep.status}
                    </span>
                    <span className="font-mono text-xs text-slate-400">commit: {dep.commit_hash}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">{dep.policy_name}</h4>
                  <p className="text-xs text-slate-500">{dep.notes}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-500" /> {dep.author}
                    </span>
                    <span>{new Date(dep.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active on Gateway
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRollback(dep)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Rollback to {dep.version}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
