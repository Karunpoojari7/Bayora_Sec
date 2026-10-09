import React, { useState, useEffect } from 'react';
import { Award, RefreshCw, Download, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { TestIntegrityPassport } from '../../types';
import { api } from '../../services/api';
import { PassportCard } from '../../components/PassportCard';

interface PassportAdminPageProps {
  evaluationId: string;
}

export const PassportAdminPage: React.FC<PassportAdminPageProps> = ({ evaluationId }) => {
  const [passport, setPassport] = useState<TestIntegrityPassport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (evaluationId) {
      loadPassport();
    }
  }, [evaluationId]);

  const loadPassport = async () => {
    setLoading(true);
    try {
      const data = await api.getPassport(evaluationId);
      setPassport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!passport) return;
    const blob = new Blob([JSON.stringify(passport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bayora-passport-${passport.evaluation_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Test Integrity Passport™ Attestation</h2>
          <p className="text-slate-500 text-sm mt-1">
            Cryptographically certified safety report. Anchored by the Merkle root of the immutable evidence ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            disabled={!passport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON Attestation
          </button>
          <button
            onClick={loadPassport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Attestation
          </button>
        </div>
      </div>

      {loading && !passport ? (
        <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Award className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
          <div>Synthesizing verifiable Test Integrity Passport...</div>
        </div>
      ) : passport ? (
        <PassportCard passport={passport} onExportJson={handleExportJson} />
      ) : (
        <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No passport record found for this evaluation.
        </div>
      )}
    </div>
  );
};
