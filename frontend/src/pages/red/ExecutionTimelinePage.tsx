import React, { useState, useEffect } from 'react';
import { Clock, Filter, ArrowDown, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { Attack } from '../../types';
import { api } from '../../services/api';

interface ExecutionTimelinePageProps {
  evaluationId: string;
}

export const ExecutionTimelinePage: React.FC<ExecutionTimelinePageProps> = ({ evaluationId }) => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [filterResult, setFilterResult] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (evaluationId) {
      loadTimeline();
    }
  }, [evaluationId]);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await api.listAttacks(evaluationId);
      setAttacks(data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = attacks.filter(a => {
    if (filterResult === 'ALL') return true;
    return a.result_class === filterResult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-slate-900">EXECUTION TIMELINE</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-bold">
              REAL-TIME EVENT STREAM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit stream of adversarial execution sequences, policy evaluations, and outcome telemetry.
          </p>
        </div>

        <button
          onClick={loadTimeline}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 shadow-subtle cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>REFRESH TIMELINE</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 font-semibold">
          TOTAL LOGGED ATTEMPTS: <span className="text-slate-900 font-bold">{attacks.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-500">FILTER OUTCOME:</span>
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 rounded-lg px-2.5 py-1"
          >
            <option value="ALL">All Outcomes ({attacks.length})</option>
            <option value="BLOCKED">Blocked by Gateway</option>
            <option value="VULNERABLE">Policy Bypassed</option>
            <option value="ALLOWED">Standard Response</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 bg-white rounded-xl border border-slate-200">
            No attack events match the selected criteria.
          </div>
        ) : (
          filtered.map((atk, idx) => (
            <React.Fragment key={atk.id}>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-slate-900">{atk.id}</span>
                    <span className="text-xs font-mono text-slate-600 font-medium">— {atk.category}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                      {atk.severity}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Payload Hash: <span className="text-blue-700 font-bold">{atk.payload_hash}</span> &bull; Latency: {atk.latency_ms}ms &bull; Operator: {atk.submitted_by}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    atk.result_class === 'BLOCKED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : atk.result_class === 'VULNERABLE'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {atk.result_class}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(atk.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {idx < filtered.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
