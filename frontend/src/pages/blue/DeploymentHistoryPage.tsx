import React, { useState } from 'react';
import { History, Shield, CheckCircle2, RotateCcw, Lock, UserCheck, Check } from 'lucide-react';

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

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleRollback = (dep: any) => {
    setStatusMsg(`Successfully rolled back active gateway defense to ${dep.version}.`);
    setDeployments(prev => prev.map(d => ({
      ...d,
      status: d.version === dep.version ? 'ACTIVE' : d.status === 'ACTIVE' ? 'SUPERSEDED' : d.status
    })));
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#00F5A0]" />
            Policy Deployment & Audit History
          </h1>
          <p className="text-[#91B8A7] text-xs mt-1">
            Immutable audit record of all policy deployments, rollback events, and cryptographic signatures.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#082219] text-[#00F5A0] text-xs rounded-xl border border-[#00F5A0]/40 font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Deployment Timeline */}
      <div className="bg-[#061A13] rounded-xl border border-[#124B37] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#124B37] font-bold text-[#E8FFF5] text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00F5A0]" />
            Deployment Ledger ({deployments.length})
          </span>
          <span className="text-[10px] text-[#587D6E]">Cryptographically Chained</span>
        </div>

        <div className="divide-y divide-[#124B37]/40">
          {deployments.map((dep) => {
            const isActive = dep.status === 'ACTIVE';
            return (
              <div key={dep.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#082219]/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00F5A0]">{dep.version}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                      isActive ? 'bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/30' :
                      dep.status === 'ROLLED_BACK' ? 'bg-[#FF4568]/15 text-[#FF4568] border border-[#FF4568]/30' :
                      'bg-[#082219] text-[#587D6E]'
                    }`}>
                      {dep.status}
                    </span>
                    <span className="text-[10px] text-[#587D6E]">commit: {dep.commit_hash}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#E8FFF5]">{dep.policy_name}</h4>
                  <p className="text-[11px] text-[#91B8A7]">{dep.notes}</p>
                  <div className="text-[10px] text-[#587D6E] flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-[#587D6E]" /> {dep.author}
                    </span>
                    <span>{new Date(dep.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#082219] text-[#00F5A0] border border-[#00F5A0] text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(0,245,160,0.2)]">
                      <Check className="w-4 h-4 text-[#00F5A0]" /> Active on Gateway
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRollback(dep)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#91B8A7] hover:text-[#E8FFF5] bg-[#051811] hover:bg-[#082219] rounded-lg transition-colors border border-[#124B37] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#00F5A0]" />
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
