import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Eye, EyeOff, Lock, Filter, Search, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { BlueViewData } from '../../types';

interface LiveAlertsPageProps {
  evaluationId: string;
}

export const LiveAlertsPage: React.FC<LiveAlertsPageProps> = ({ evaluationId }) => {
  const [blueData, setBlueData] = useState<BlueViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [disclosureModal, setDisclosureModal] = useState<any | null>(null);
  const [justification, setJustification] = useState('');
  const [disclosureStatus, setDisclosureStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, [evaluationId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getBlueView(evaluationId);
      setBlueData(data);
      const evts = data?.sanitized_attacks || [];
      if (evts.length > 0 && !selectedAlert) {
        setSelectedAlert(evts[0]);
      }
    } catch (err) {
      console.error('Failed to load sanitized blue alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDisclosure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclosureModal || !justification) return;
    try {
      await api.requestDisclosure(evaluationId, disclosureModal.id || disclosureModal.event_id, justification);
      setDisclosureStatus('Disclosure request submitted for cryptographic authorization.');
      setTimeout(() => {
        setDisclosureModal(null);
        setJustification('');
        setDisclosureStatus(null);
      }, 2000);
    } catch (err: any) {
      setDisclosureStatus(`Request failed: ${err.message}`);
    }
  };

  const events = blueData?.sanitized_attacks || [];

  const filteredEvents = events.filter((ev: any) => {
    const matchesSev = filterSeverity === 'ALL' || ev.severity === filterSeverity;
    const matchesSearch = searchQuery === '' ||
      (ev.category && ev.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ev.id && ev.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ev.result_class && ev.result_class.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  const highCount = events.filter((e: any) => e.severity === 'HIGH' || e.severity === 'CRITICAL').length;
  const medCount = events.filter((e: any) => e.severity === 'MEDIUM').length;
  const lowCount = events.filter((e: any) => e.severity === 'LOW' || !e.severity).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Live Defense Alerts & Telemetry</h2>
          <p className="text-slate-500 text-sm mt-1">
            Sanitized adversarial event stream. Confidential payloads are cryptographically blinded to preserve evaluation integrity.
          </p>
        </div>
        <button
          onClick={loadAlerts}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Incident Queue
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Incidents</div>
          <div className="text-2xl font-black text-slate-900 mt-2">{events.length}</div>
          <p className="text-xs text-slate-500 mt-1">Sanitized incoming telemetry</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Critical / High Severity</div>
          <div className="text-2xl font-black text-rose-700 mt-2">{highCount}</div>
          <p className="text-xs text-rose-600 mt-1">Requires active policy tuning</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Medium Severity</div>
          <div className="text-2xl font-black text-amber-700 mt-2">{medCount}</div>
          <p className="text-xs text-amber-600 mt-1">Monitored probe attempts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active Guardrails</div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{blueData?.active_defenses?.length || 0}</div>
          <p className="text-xs text-emerald-600 mt-1">Policies actively defending</p>
        </div>
      </div>

      {/* Privacy Guarantee Notice */}
      <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-bold">Zero Knowledge Red-Blue Isolation:</span> Unrestricted raw attack payloads are withheld from the defensive console. To review specific exploit vectors, an audited, cryptographically-logged disclosure request must be submitted.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterSeverity === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Split Alert Queue & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
            <span>Live Incident Stream ({filteredEvents.length})</span>
            <span className="text-xs text-slate-400 font-normal">Sanitized telemetry</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Streaming sanitized events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No telemetry recorded for this evaluation yet.
              </div>
            ) : (
              filteredEvents.map((ev: any, idx: number) => {
                const isSelected = selectedAlert?.id === ev.id || (!selectedAlert && idx === 0);
                const isHigh = ev.severity === 'HIGH' || ev.severity === 'CRITICAL';
                return (
                  <div
                    key={ev.id || idx}
                    onClick={() => setSelectedAlert(ev)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {ev.id ? ev.id.substring(0, 14) : `EVT-${idx + 1}`}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        isHigh ? 'bg-rose-100 text-rose-800' :
                        ev.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ev.severity || 'LOW'}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 mb-1">{ev.category || 'Adversarial Telemetry'}</div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {ev.sanitized_summary || `Verdict: ${ev.result_class || 'BLOCKED'} by active defense boundary.`}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: {ev.result_class || ev.status || 'BLOCKED'}</span>
                      <span className="font-mono text-[10px]">{new Date(ev.created_at || ev.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Sanitized Telemetry & Reveal Request */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedAlert ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Telemetry Incident</h3>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded uppercase">
                      {selectedAlert.result_class || selectedAlert.action_taken || 'FILTERED'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-500 mt-1">
                    Event Sequence: {selectedAlert.id || selectedAlert.event_id || 'EVT-LIVE'} | Evaluation: {evaluationId}
                  </p>
                </div>

                <button
                  onClick={() => setDisclosureModal(selectedAlert)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Request Full Disclosure
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Sanitized Summary & Heuristic Signature
                  </label>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 font-mono">
                    {selectedAlert.sanitized_summary || 'Pattern match against Delimiter Override signature in active defense rule.'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Confidential Payload Status
                  </label>
                  <div className="p-4 bg-slate-900 text-slate-300 rounded-lg border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold">
                      <EyeOff className="w-4 h-4" /> [PROTECTED ADVERSARIAL PAYLOAD]
                    </div>
                    <p className="text-slate-400 leading-relaxed font-mono">
                      Payload hash: {selectedAlert.payload_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Zero-knowledge isolation prevents defense over-fitting to specific test strings. Submit an audited disclosure request if RCA requires raw bytes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 font-medium block">Detection Category</span>
                    <span className="font-semibold text-slate-900">{selectedAlert.category || 'Prompt Injection'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 font-medium block">Policy Enforced</span>
                    <span className="font-semibold text-slate-900 font-mono">{selectedAlert.policy_version || 'v2.1.0'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Select an incident from the queue to view sanitized telemetry details.
            </div>
          )}
        </div>
      </div>

      {/* Audited Disclosure Request Modal */}
      {disclosureModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Audited Payload Disclosure Request
              </h3>
              <button
                onClick={() => { setDisclosureModal(null); setDisclosureStatus(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Requesting unrestricted payload access for incident <span className="font-mono font-bold text-slate-800">{disclosureModal.event_id || 'EVT'}</span> requires formal security justification and will be permanently recorded in the cryptographic audit ledger.
            </p>

            <form onSubmit={handleRequestDisclosure} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Root-Cause Analysis Justification *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide detailed justification (e.g., investigating potential zero-day false positive or catastrophic extraction pattern)..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {disclosureStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium">
                  {disclosureStatus}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setDisclosureModal(null); setDisclosureStatus(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Submit Cryptographic Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
