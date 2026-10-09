import React, { useState, useEffect } from 'react';
import { Bug, Play, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { ContaminationCheck } from '../../types';
import { api } from '../../services/api';

interface ContaminationPageProps {
  evaluationId: string;
}

export const ContaminationPage: React.FC<ContaminationPageProps> = ({ evaluationId }) => {
  const [checks, setChecks] = useState<ContaminationCheck[]>([]);
  const [customProbe, setCustomProbe] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<ContaminationCheck | null>(null);

  useEffect(() => {
    if (evaluationId) {
      loadChecks();
    }
  }, [evaluationId]);

  const loadChecks = async () => {
    try {
      const data = await api.listContaminationChecks(evaluationId);
      setChecks(data);
      if (data.length > 0) setLastCheck(data[0]);
    } catch (e) {}
  };

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await api.runContaminationCheck(evaluationId, customProbe || undefined);
      setLastCheck(res);
      setCustomProbe('');
      loadChecks();
    } catch (err: any) {
      alert(`Contamination check failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Canary & Contamination Verification</h2>
          <p className="text-slate-500 text-sm mt-1">
            Inject synthetic canary tokens into evaluation sessions to verify zero prior test prompt memory leakage.
          </p>
        </div>
        <button
          onClick={loadChecks}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Checks
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Canary Isolation Guarantee</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Bayora inserts cryptographically unique canary tokens (e.g. <span className="font-mono text-purple-700 bg-purple-50 px-1 py-0.5 rounded">CANARY-SEC-xxxx</span>) into simulated prior-session contexts. The probe test attempts to extract this canary from the target LLM. If the canary is returned, session contamination is confirmed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Run Check */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Bug className="w-4 h-4 text-purple-600" />
            Trigger Contamination Probe
          </h3>

          <form onSubmit={handleRunCheck} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Custom Probe Query (Optional)
              </label>
              <textarea
                rows={4}
                value={customProbe}
                onChange={e => setCustomProbe(e.target.value)}
                placeholder="Leave blank to use default automated canary extraction prompt..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Injecting & Verifying Canary...' : 'Execute Canary Check'}
            </button>
          </form>
        </div>

        {/* Right: Latest Result */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Latest Verification Report</span>
              {lastCheck && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                  !lastCheck.is_clean ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {!lastCheck.is_clean ? 'CONTAMINATED' : 'ISOLATION VERIFIED (CLEAN)'}
                </span>
              )}
            </h3>

            {lastCheck ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Canary Token Injected</span>
                  <span className="font-mono font-bold text-purple-700">{lastCheck.canary_token}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Probe Prompt</span>
                  <p className="font-mono text-slate-800">{lastCheck.probe_query}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Target Model Response</span>
                  <p className="font-mono text-slate-800">{lastCheck.target_response}</p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                No contamination checks executed yet. Run a check to verify session boundaries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
