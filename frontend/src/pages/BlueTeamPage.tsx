import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, Plus, CheckCircle2,
  AlertTriangle, Filter, Play, ArrowRight, Lock
} from 'lucide-react';
import { Defense, SecurityFinding, BlueViewData, Role } from '../types';
import { api } from '../services/api';

interface BlueTeamPageProps {
  evaluationId: string;
  currentRole: Role;
  onDefenseCreated: () => void;
}

export const BlueTeamPage: React.FC<BlueTeamPageProps> = ({
  evaluationId,
  currentRole,
  onDefenseCreated,
}) => {
  const [blueData, setBlueData] = useState<BlueViewData | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState('keyword_filter');
  const [pattern, setPattern] = useState('');
  const [action, setAction] = useState('BLOCK');
  const [isCreating, setIsCreating] = useState(false);

  // Defense tester state
  const [selectedDefenseId, setSelectedDefenseId] = useState<string>('');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadBlueView();
  }, [evaluationId]);

  const loadBlueView = async () => {
    try {
      const data = await api.getBlueView(evaluationId);
      setBlueData(data);
      if (data.active_defenses.length > 0 && !selectedDefenseId) {
        setSelectedDefenseId(data.active_defenses[0].id);
      }
    } catch (e) {}
  };

  const handleCreateDefense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !pattern) return;
    setIsCreating(true);
    try {
      await api.createDefense(evaluationId, {
        name: ruleName,
        rule_type: ruleType,
        pattern,
        action,
      });
      setRuleName('');
      setPattern('');
      loadBlueView();
      onDefenseCreated();
    } catch (err: any) {
      alert(`Failed to create defense: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestDefense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefenseId || !testInput) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testDefense(evaluationId, selectedDefenseId, testInput);
      setTestResult(res);
    } catch (err: any) {
      alert(`Test failed: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-white">BLUE TEAM DEFENSIVE STUDIO</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              SANITIZED TELEMETRY VIEW
            </span>
          </div>
          <p className="text-xs text-bayora-textMuted mt-0.5">
            Configure Zero-Trust policy guardrails, validate defenses, and inspect sanitized findings.
          </p>
        </div>
      </div>

      {/* Information Barrier Notice */}
      <div className="p-3.5 rounded-xl bg-bayora-bg border border-bayora-border text-xs font-mono text-bayora-textMuted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>ZERO-TRUST BARRIER: Raw Red Team attack payloads are strictly redacted from this workspace.</span>
        </div>
        <span className="text-emerald-400 font-bold">SANITIZED ✓</span>
      </div>

      {/* Main Grid: Create Defense Rule & Live Defense Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Defense Rule Studio */}
        <form onSubmit={handleCreateDefense} className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
          <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold border-b border-bayora-border pb-3">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>DEPLOY ZERO-TRUST DEFENSIVE GUARDRAIL</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">RULE NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Instruction Fence: System Prompt Extraction"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">RULE TYPE</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                >
                  <option value="keyword_filter">Keyword Filter</option>
                  <option value="regex_guard">Regex Guard</option>
                  <option value="instruction_fence">Instruction Fence</option>
                  <option value="canary_trap">Canary Trap</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">POLICY ACTION</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
                >
                  <option value="BLOCK">BLOCK (Drop Request)</option>
                  <option value="REDACT">REDACT (Sanitize In-Place)</option>
                  <option value="QUARANTINE">QUARANTINE (Flag for Review)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">PATTERN / EXPRESSION</label>
              <input
                type="text"
                required
                placeholder="e.g. reveal the protected system prompt"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 rounded-xl bg-bayora-accent hover:bg-blue-600 text-white text-xs font-mono font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              {isCreating ? 'DEPLOYING...' : 'DEPLOY TO POLICY GATEWAY'}
            </button>
          </div>
        </form>

        {/* Right: Live Defense Rule Tester */}
        <form onSubmit={handleTestDefense} className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
          <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold border-b border-bayora-border pb-3">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>LIVE DEFENSE VALIDATION SANDBOX</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">SELECT TARGET RULE</label>
              <select
                value={selectedDefenseId}
                onChange={(e) => setSelectedDefenseId(e.target.value)}
                className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
              >
                {blueData?.active_defenses.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.rule_type} → {d.action})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">TEST INPUT VECTOR</label>
              <textarea
                rows={3}
                required
                placeholder="Enter sample input to evaluate defensive intercept..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full bg-bayora-bg border border-bayora-border rounded-lg p-2.5 text-white focus:outline-none focus:border-bayora-accent"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            >
              <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>TEST DEFENSE RULE</span>
            </button>
          </div>

          {/* Tester Result */}
          {testResult && (
            <div className="p-3 rounded-xl bg-bayora-bg border border-bayora-border space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">RULE MATCHED:</span>
                <span className={`font-bold ${testResult.matched ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {testResult.matched ? 'YES (INTERCEPTED)' : 'NO (PASSED)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ACTION TAKEN:</span>
                <span className="text-cyan-400 font-bold">{testResult.action_taken}</span>
              </div>
              <div className="pt-2 border-t border-bayora-border text-slate-300">
                <span className="text-slate-500 text-[10px] block">OUTPUT:</span>
                <span className="text-white">{testResult.sanitized_output}</span>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Active Defenses Table */}
      <div className="p-5 rounded-2xl bg-bayora-card border border-bayora-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">ACTIVE POLICY GUARDRAILS</h3>
          <span className="text-xs font-mono text-bayora-textMuted">{blueData?.active_defenses.length ?? 0} Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bayora-border text-slate-500 text-[11px]">
                <th className="pb-3 font-medium">RULE ID</th>
                <th className="pb-3 font-medium">NAME</th>
                <th className="pb-3 font-medium">TYPE</th>
                <th className="pb-3 font-medium">PATTERN</th>
                <th className="pb-3 font-medium">ACTION</th>
                <th className="pb-3 font-medium text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bayora-border/60">
              {blueData?.active_defenses.map((def) => (
                <tr key={def.id} className="hover:bg-bayora-cardHover/40 transition-colors">
                  <td className="py-3 text-white font-bold">{def.id}</td>
                  <td className="py-3 text-slate-200">{def.name}</td>
                  <td className="py-3 text-cyan-400">{def.rule_type}</td>
                  <td className="py-3 text-slate-400 font-mono">"{def.pattern}"</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {def.action}
                    </span>
                  </td>
                  <td className="py-3 text-right text-emerald-400 font-bold">ACTIVE ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
