import React, { useState } from 'react';
import { Database, Lock, Eye, Download, Search, Shield, Key } from 'lucide-react';

export const PayloadVaultPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const payloads = [
    {
      id: 'PLD-001',
      name: 'Delimiter Escape & Polyglot Payload',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      category: 'Prompt Injection',
      severity: 'CRITICAL',
      size: '284 B',
      created: '2024-01-26 10:24:00'
    },
    {
      id: 'PLD-002',
      name: 'Canary Extraction JSON Trigger',
      hash: '9f83c6d12b3e4a5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a',
      category: 'Canary Leakage',
      severity: 'HIGH',
      size: '192 B',
      created: '2024-01-26 10:15:30'
    },
    {
      id: 'PLD-003',
      name: 'DAN 14.0 Uncensored Persona Template',
      hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      category: 'Jailbreak',
      severity: 'CRITICAL',
      size: '512 B',
      created: '2024-01-25 18:00:00'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-[#FF233F]" />
            Confidential Payload Vault
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Zero-knowledge cryptographic payload vault. Raw exploit strings are strictly segregated from defensive telemetry.
          </p>
        </div>
      </div>

      <div className="bg-[#0D1118] rounded-xl border border-[#39202A] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#39202A] font-bold text-[#F4F6FA] text-xs flex items-center justify-between">
          <span>Vaulted Adversarial Payloads ({payloads.length})</span>
          <span className="text-[10px] text-[#FF5268]">Cryptographically Salted & Hashed</span>
        </div>

        <div className="divide-y divide-[#39202A]/40 text-xs">
          {payloads.map((p) => (
            <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#131720]/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#16D9FF]">{p.id}</span>
                  <span className="text-[#F4F6FA] font-bold">{p.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FF233F]/15 text-[#FF233F]">
                    {p.severity}
                  </span>
                </div>
                <div className="text-[10px] text-[#737D90]">SHA-256: {p.hash}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Payload ${p.id} raw inspection verified in Red Team sandbox.`)}
                  className="px-3 py-1 rounded bg-[#131720] hover:bg-[#191D27] border border-[#39202A] text-[#16D9FF] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> View In Sandbox
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
