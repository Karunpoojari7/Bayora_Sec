import React, { useState } from 'react';
import { Crosshair, Database, Shield, Radio, Search, Filter, ExternalLink, Zap } from 'lucide-react';

export const ThreatIntelPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const signatures = [
    { id: 'SIG-2024-001', name: 'Direct System Prompt Exfiltration (Zero-Turn)', severity: 'HIGH', category: 'Extraction', source: 'OWASP LLM01', status: 'SYNCHRONIZED' },
    { id: 'SIG-2024-002', name: 'Universal Adversarial Suffix Injection (GCG)', severity: 'CRITICAL', category: 'Jailbreak', source: 'arXiv:2307.15043', status: 'SYNCHRONIZED' },
    { id: 'SIG-2024-003', name: 'Base64 / UTF-8 Polyglot Token Wrap', severity: 'MEDIUM', category: 'Evasion', source: 'MITRE ATLAS', status: 'SYNCHRONIZED' },
    { id: 'SIG-2024-004', name: 'Multi-Turn Context Usurpation via Fake Assistant Turns', severity: 'HIGH', category: 'Role Hijack', source: 'Bayora Zero-Day Lab', status: 'SYNCHRONIZED' },
    { id: 'SIG-2024-005', name: 'Canary Extraction via Code Interpreter Formatting', severity: 'CRITICAL', category: 'Canary Trap', source: 'Bayora Internal', status: 'SYNCHRONIZED' }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8FFF5] tracking-tight flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#00F5A0]" />
            Threat Intelligence & Signature Feed
          </h1>
          <p className="text-[#91B8A7] text-xs mt-1">
            Real-time feed of known adversarial heuristics, CVE mappings, and zero-day LLM attack patterns.
          </p>
        </div>
      </div>

      <div className="bg-[#061A13] p-4 rounded-xl border border-[#124B37] shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-[#124B37] pb-2.5">
          <span className="text-xs font-bold text-[#E8FFF5]">Known Adversarial Signatures ({signatures.length})</span>
          <span className="text-[10px] text-[#00F5A0] font-bold">Redis Threat Store Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#082219] text-[#587D6E] text-[10px] uppercase border-b border-[#124B37]">
              <tr>
                <th className="px-4 py-2.5">SIGNATURE ID</th>
                <th className="px-4 py-2.5">PATTERN DESIGNATION</th>
                <th className="px-4 py-2.5">SEVERITY</th>
                <th className="px-4 py-2.5">CATEGORY</th>
                <th className="px-4 py-2.5">ORIGIN / SOURCE</th>
                <th className="px-4 py-2.5 text-right">GATEWAY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#124B37]/40">
              {signatures.map((sig) => (
                <tr key={sig.id} className="hover:bg-[#082219]/40">
                  <td className="px-4 py-3 font-bold text-[#00F5A0]">{sig.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#E8FFF5]">{sig.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      sig.severity === 'CRITICAL' ? 'bg-[#FF4568]/15 text-[#FF4568] border border-[#FF4568]/30' :
                      sig.severity === 'HIGH' ? 'bg-[#FF7A45]/15 text-[#FF7A45] border border-[#FF7A45]/30' :
                      'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                    }`}>
                      {sig.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#91B8A7]">{sig.category}</td>
                  <td className="px-4 py-3 text-[#587D6E] text-[11px]">{sig.source}</td>
                  <td className="px-4 py-3 text-right text-[#00F5A0] font-bold text-[10px]">
                    ● {sig.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
