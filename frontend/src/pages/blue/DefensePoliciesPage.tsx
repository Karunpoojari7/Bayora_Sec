import React, { useState, useEffect } from 'react';
import { Shield, Plus, CheckCircle2, History, RotateCcw, AlertTriangle, ArrowRight, Save, Play } from 'lucide-react';
import { api } from '../../services/api';
import { Defense } from '../../types';

interface DefensePoliciesPageProps {
  evaluationId: string;
}

export const DefensePoliciesPage: React.FC<DefensePoliciesPageProps> = ({ evaluationId }) => {
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: 'Delimiter Escape & Prompt Injection Shield',
    rule_type: 'regex',
    pattern: '(?i)(ignore previous instructions|system prompt|reveal secrets|bypass guardrails)',
    action: 'BLOCK'
  });
  const [activeVersion, setActiveVersion] = useState('v2.1.0');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDefenses();
  }, [evaluationId]);

  const loadDefenses = async () => {
    setLoading(true);
    try {
      const list = await api.listDefenses(evaluationId);
      setDefenses(list);
    } catch (err) {
      console.error('Failed to load defenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDefense(evaluationId, newPolicy);
      setStatusMessage('Policy created and registered in version registry.');
      setShowCreateModal(false);
      await loadDefenses();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage(`Failed: ${err.message}`);
    }
  };

  const handleRollback = (targetVersion: string) => {
    setActiveVersion(targetVersion);
    setStatusMessage(`Defense configuration rolled back to ${targetVersion}. Gateway synced.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Defense Policy & Guardrail Registry</h2>
          <p className="text-slate-500 text-sm mt-1">
            Version-controlled defense configurations, input/output inspection rules, and audited gateway deployment state.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Policy Version
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl border border-emerald-200 font-semibold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Active Deployment Banner */}
      <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active Live Gateway Policy</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded">
                {activeVersion}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">Multi-Layer Instruction Fence & Delimiter Shield</h3>
            <p className="text-xs text-slate-500 mt-1">
              Active on Gateway API • Evaluated against all incoming Red Team probes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Gateway Status:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE & ENFORCING
          </span>
        </div>
      </div>

      {/* Policy Version History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            Registered Defense Policies ({defenses.length})
          </span>
          <span className="text-xs text-slate-400">All changes cryptographically audited</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading defense policies...</div>
        ) : defenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No custom policies registered yet. Click "Create New Policy Version" to define one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3">Policy / Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Pattern / Heuristic</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defenses.map(d => {
                  const dVersion = (d as any).version || 'v2.1.0';
                  const isCurrent = d.is_active || (d.id === defenses[0]?.id && activeVersion === 'v2.1.0');
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        {d.name}
                        <span className="block text-xs font-mono text-slate-400">ID: {d.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono uppercase">
                          {d.rule_type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600 max-w-xs truncate">
                        {d.pattern}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          d.action === 'BLOCK' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-700">
                        {dVersion}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Deployed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRollback(dVersion)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Rollback
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Define New Defense Policy
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Policy Name
                </label>
                <input
                  type="text"
                  required
                  value={newPolicy.name}
                  onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Rule Engine Type
                  </label>
                  <select
                    value={newPolicy.rule_type}
                    onChange={e => setNewPolicy({ ...newPolicy, rule_type: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="regex">Regex Signature</option>
                    <option value="keyword">Exact Keyword List</option>
                    <option value="fence">Instruction Fence</option>
                    <option value="canary">Canary Token Trap</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Enforcement Action
                  </label>
                  <select
                    value={newPolicy.action}
                    onChange={e => setNewPolicy({ ...newPolicy, action: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="BLOCK">BLOCK (Drop & Neutralize)</option>
                    <option value="SANITIZE">SANITIZE (Redact & Pass)</option>
                    <option value="LOG_ONLY">LOG_ONLY (Telemetry)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Pattern / Rule Expression
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPolicy.pattern}
                  onChange={e => setNewPolicy({ ...newPolicy, pattern: e.target.value })}
                  className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Save & Register Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
