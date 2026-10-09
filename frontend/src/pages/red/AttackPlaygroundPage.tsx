import React, { useState, useEffect } from 'react';
import { Swords, Play, Lock, Eye, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { AttackLibraryItem, UserProfile } from '../../types';
import { api } from '../../services/api';
import { PayloadModal } from '../../components/PayloadModal';

interface AttackPlaygroundPageProps {
  evaluationId: string;
  currentUser: UserProfile;
}

export const AttackPlaygroundPage: React.FC<AttackPlaygroundPageProps> = ({ evaluationId, currentUser }) => {
  const [library, setLibrary] = useState<AttackLibraryItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('prompt_injection');
  const [severity, setSeverity] = useState('HIGH');
  const [systemContext, setSystemContext] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [modalAttackId, setModalAttackId] = useState<string | null>(null);

  useEffect(() => {
    if (evaluationId) {
      loadLibrary();
    }
  }, [evaluationId]);

  const loadLibrary = async () => {
    try {
      const items = await api.getAttackLibrary(evaluationId);
      setLibrary(items);
      if (items.length > 0 && !prompt) {
        setPrompt(items[0].sample_prompt);
        setCategory(items[0].category);
        setSeverity(items[0].severity);
      }
    } catch (e) {}
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setIsExecuting(true);
    setLastResult(null);

    try {
      const res = await api.submitAttack(evaluationId, {
        prompt,
        category,
        severity
      });
      setLastResult(res);
    } catch (err: any) {
      alert(`Attack execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold font-mono text-slate-900">ATTACK PLAYGROUND</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-bold">
            CONFIDENTIAL REPOSITORY
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Craft custom prompt injection vectors and evaluate real-time policy gateway interception.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Custom Exploit Editor */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleExecute} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-600" />
                <span>INTERACTIVE PAYLOAD CONSOLE</span>
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 rounded-lg px-2.5 py-1"
                >
                  <option value="prompt_injection">Prompt Injection</option>
                  <option value="instruction_override">Instruction Override</option>
                  <option value="system_prompt_extraction">System Prompt Extraction</option>
                  <option value="data_exfiltration">Data Exfiltration</option>
                  <option value="tool_abuse">Tool Abuse Simulation</option>
                </select>

                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-[11px] font-mono text-red-700 font-bold rounded-lg px-2.5 py-1"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold text-[11px] font-mono block mb-1">
                ADVERSARIAL PROMPT PAYLOAD
              </label>
              <textarea
                rows={5}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter adversarial prompt vector..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>CONFIDENTIAL: Vaulted in encrypted table</span>
              </span>
              <button
                type="submit"
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                <span>{isExecuting ? 'EVALUATING GATEWAY...' : 'SUBMIT ADVERSARIAL TEST'}</span>
              </button>
            </div>
          </form>

          {/* Result Output */}
          {lastResult && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">EXECUTION OUTCOME:</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    lastResult.result_class === 'BLOCKED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : lastResult.result_class === 'VULNERABLE'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {lastResult.result_class}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Latency: {lastResult.latency_ms}ms &bull; ID: {lastResult.attack_id}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
                {lastResult.response}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                <span>SHA-256 HASH: <span className="text-blue-700 font-bold">{lastResult.payload_hash}</span></span>
                {lastResult.blocked_by && (
                  <span className="text-emerald-700 font-semibold">Intercepted by: {lastResult.blocked_by}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Library Quick-Select */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>APPROVED TEST VECTORS</span>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {library.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setPrompt(item.sample_prompt);
                  setCategory(item.category);
                  setSeverity(item.severity);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-red-300 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                    {item.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalAttackId && (
        <PayloadModal
          isOpen={true}
          onClose={() => setModalAttackId(null)}
          evaluationId={evaluationId}
          attackId={modalAttackId}
          currentRole={currentUser.role}
        />
      )}
    </div>
  );
};
