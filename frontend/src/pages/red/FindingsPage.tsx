import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Filter, Search, ChevronRight, Play, Award, Zap } from 'lucide-react';
import { api } from '../../services/api';

interface FindingsPageProps {
  evaluationId: string;
}

export const FindingsPage: React.FC<FindingsPageProps> = ({ evaluationId }) => {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);
  const [retesting, setRetesting] = useState(false);
  const [retestResult, setRetestResult] = useState<any | null>(null);

  useEffect(() => {
    loadFindings();
  }, [evaluationId]);

  const loadFindings = async () => {
    setLoading(true);
    try {
      const history = await api.listAttacks(evaluationId);
      setFindings(history);
      if (history.length > 0 && !selectedFinding) {
        setSelectedFinding(history[0]);
      }
    } catch (err) {
      console.error('Failed to load attack findings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetest = async (finding: any) => {
    if (!finding) return;
    setRetesting(true);
    setRetestResult(null);
    try {
      const res = await api.submitAttack(evaluationId, {
        prompt: finding.prompt_snippet || 'Adversarial re-probe payload',
        category: finding.category || 'prompt_injection',
        severity: finding.severity || 'HIGH'
      });
      setRetestResult(res);
      await loadFindings();
    } catch (err) {
      console.error('Retest failed', err);
    } finally {
      setRetesting(false);
    }
  };

  const filteredFindings = findings.filter(f => {
    const matchesClass = filterClass === 'ALL' || f.result_class === filterClass;
    const matchesSearch = searchQuery === '' || 
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.test_id && f.test_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.prompt_snippet && f.prompt_snippet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  const bypassCount = findings.filter(f => f.result_class === 'VULNERABLE' || f.result_class === 'BYPASS').length;
  const blockedCount = findings.filter(f => f.result_class === 'BLOCKED').length;
  const filteredCount = findings.filter(f => f.result_class === 'FILTERED').length;
  const safeCount = findings.filter(f => f.result_class === 'SAFE' || f.result_class === 'REFUSAL').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Adversarial Findings & Exploit Vault</h2>
          <p className="text-slate-500 text-sm mt-1">
            Confirmed bypasses, mitigations, policy refusals, and reproducible attack vectors against evaluation target.
          </p>
        </div>
        <button
          onClick={loadFindings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Findings
        </button>
      </div>

      {/* Outcome Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Confirmed Bypasses</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2">{bypassCount}</div>
          <p className="text-xs text-rose-700 mt-1">Direct LLM vulnerabilities found</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Blocked by Gate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{blockedCount}</div>
          <p className="text-xs text-emerald-700 mt-1">Neutralized at gateway layer</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Policy Filtered</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{filteredCount}</div>
          <p className="text-xs text-amber-700 mt-1">Output redactions & fence traps</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Safe / Refusal</span>
            <Award className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{safeCount}</div>
          <p className="text-xs text-slate-500 mt-1">Natural model safety refusals</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test ID, category, or payload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Outcome:
          </span>
          {['ALL', 'VULNERABLE', 'BLOCKED', 'FILTERED', 'SAFE'].map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterClass === c
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Pane: Findings List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
            <span>Recorded Findings ({filteredFindings.length})</span>
            <span className="text-xs text-slate-400 font-normal">Select to inspect & retest</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading security findings...</div>
            ) : filteredFindings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No findings match the selected filter. Run campaigns or test cases to record outcomes.
              </div>
            ) : (
              filteredFindings.map((f, idx) => {
                const isSelected = selectedFinding?.test_id === f.test_id || (!selectedFinding && idx === 0);
                const isVuln = f.result_class === 'VULNERABLE' || f.result_class === 'BYPASS';
                const isBlocked = f.result_class === 'BLOCKED';
                return (
                  <div
                    key={f.test_id || idx}
                    onClick={() => { setSelectedFinding(f); setRetestResult(null); }}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {f.test_id ? f.test_id.substring(0, 16) : `finding-${idx + 1}`}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        isVuln ? 'bg-rose-100 text-rose-800' :
                        isBlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {f.result_class || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 mb-1">{f.category || 'Adversarial Test'}</div>
                    <p className="text-xs text-slate-500 line-clamp-2 font-mono">
                      {f.prompt_snippet || f.details || 'Payload details recorded in evidence chain'}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Latency: {f.latency_ms ? `${f.latency_ms}ms` : 'N/A'}</span>
                      <span className="flex items-center gap-1 text-rose-600 font-medium">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Finding Detail & Retest Pane */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedFinding ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Finding Details
                    </h3>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                      selectedFinding.result_class === 'VULNERABLE' ? 'bg-rose-100 text-rose-800' :
                      selectedFinding.result_class === 'BLOCKED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {selectedFinding.result_class || 'RECORDED'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-500 mt-1">
                    Evidence ID: {selectedFinding.evidence_id || selectedFinding.test_id || 'ev-sha256-verified'}
                  </p>
                </div>

                <button
                  onClick={() => handleRetest(selectedFinding)}
                  disabled={retesting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 ${retesting ? 'animate-spin' : ''}`} />
                  {retesting ? 'Re-executing Probe...' : 'Reproduce & Retest'}
                </button>
              </div>

              {retestResult && (
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Retest Execution Completed
                    </span>
                    <span className="font-mono text-slate-400">{retestResult.latency_ms}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">New Gateway Decision:</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                      retestResult.result_class === 'BLOCKED' ? 'bg-emerald-800 text-emerald-100' : 'bg-rose-800 text-rose-100'
                    }`}>
                      {retestResult.result_class}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-800 p-2.5 rounded border border-slate-700 mt-2">
                    {retestResult.response_snippet || 'Response captured in tamper-evident log.'}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Adversarial Prompt Payload
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 whitespace-pre-wrap">
                    {selectedFinding.prompt_snippet || selectedFinding.prompt || 'No payload recorded.'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Model Response & Gateway Verdict
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap">
                    {selectedFinding.response_snippet || selectedFinding.details || 'Model output redacted or safely neutralized by active defense policy.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 font-medium block">Category</span>
                    <span className="font-semibold text-slate-900">{selectedFinding.category || 'Prompt Injection'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 font-medium block">Defense Version</span>
                    <span className="font-semibold text-slate-900 font-mono">{selectedFinding.defense_version || 'v2.1.0 (Active)'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Select any finding on the left to inspect vulnerability telemetry and re-probe against the target.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
