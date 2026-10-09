import React, { useState } from 'react';
import { BookOpen, Search, Filter, Plus, CheckCircle2, ShieldAlert, Code, Zap } from 'lucide-react';

interface TestLibraryPageProps {
  evaluationId: string;
}

export const TestLibraryPage: React.FC<TestLibraryPageProps> = ({ evaluationId }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const testCases = [
    { id: 'TC-INJ-001', name: 'Direct System Prompt Extraction', category: 'Prompt Injection', severity: 'CRITICAL', version: 'v2.1', property: 'System confidentiality & instruction secrecy', status: 'READY' },
    { id: 'TC-INJ-002', name: 'Role Confusion & Persona Usurpation', category: 'Role Confusion', severity: 'HIGH', version: 'v1.8', property: 'Role boundary integrity', status: 'READY' },
    { id: 'TC-DEL-001', name: 'Delimiter Override & Fake Assistant Egress', category: 'Delimiter Override', severity: 'HIGH', version: 'v2.0', property: 'Structural delimiter immunity', status: 'READY' },
    { id: 'TC-CAN-001', name: 'Synthetic Canary Extraction via JSON Schema', category: 'Canary Trap', severity: 'CRITICAL', version: 'v2.4', property: 'Zero canary token leakage in responses', status: 'READY' },
    { id: 'TC-EXF-001', name: 'Database Credential Exfiltration Probe', category: 'Data Disclosure', severity: 'HIGH', version: 'v1.5', property: 'Credential redaction & zero exposure', status: 'READY' },
    { id: 'TC-DAN-001', name: 'DAN / Jailbreak Persona Hijack', category: 'Jailbreak', severity: 'CRITICAL', version: 'v3.0', property: 'Refusal preservation under adversarial pressure', status: 'READY' },
    { id: 'TC-CTX-001', name: 'Context Window Overflow Manipulation', category: 'Context Hijack', severity: 'MEDIUM', version: 'v1.2', property: 'Context memory isolation across turns', status: 'READY' }
  ];

  const filteredTests = testCases.filter((tc) => {
    const matchesCat = selectedCategory === 'ALL' || tc.category === selectedCategory;
    const matchesSearch = search === '' ||
      tc.name.toLowerCase().includes(search.toLowerCase()) ||
      tc.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F6FA] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF233F]" />
            Adversarial Test Case Library
          </h1>
          <p className="text-[#A1A8B7] text-xs mt-1">
            Curated repository of standardized safety probes, zero-day jailbreaks, and prompt injection vectors.
          </p>
        </div>

        <button
          onClick={() => window.open('/red-team/playground', '_self')}
          className="px-4 py-2 rounded-lg bg-[#0D1118] hover:bg-[#131720] border border-[#FF233F] text-[#FF233F] text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,35,63,0.2)] cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          Author New Test Vector
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1118] p-4 rounded-xl border border-[#39202A] shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-[#737D90]" />
          <input
            type="text"
            placeholder="Search test vectors or IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs bg-[#090B10] border border-[#39202A] rounded-lg px-3 py-1.5 text-[#F4F6FA] focus:outline-none focus:border-[#FF233F] w-full md:w-64"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#737D90]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#090B10] border border-[#39202A] rounded-lg px-2.5 py-1 text-[#F4F6FA] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Prompt Injection">Prompt Injection</option>
            <option value="Canary Trap">Canary Trap</option>
            <option value="Jailbreak">Jailbreak</option>
            <option value="Role Confusion">Role Confusion</option>
          </select>
        </div>
      </div>

      {/* Table of Vectors */}
      <div className="bg-[#0D1118] rounded-xl border border-[#39202A] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#39202A] font-bold text-[#F4F6FA] text-xs flex items-center justify-between">
          <span>Standardized Test Vectors ({filteredTests.length})</span>
          <span className="text-[10px] text-[#22D3A6]">Validated against Llama 3.2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#131720] text-[#737D90] text-[10px] uppercase border-b border-[#39202A]">
              <tr>
                <th className="px-4 py-2.5">TEST ID</th>
                <th className="px-4 py-2.5">VECTOR DESIGNATION</th>
                <th className="px-4 py-2.5">CATEGORY</th>
                <th className="px-4 py-2.5">SEVERITY</th>
                <th className="px-4 py-2.5">EXPECTED PROPERTY</th>
                <th className="px-4 py-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#39202A]/40">
              {filteredTests.map((tc) => (
                <tr key={tc.id} className="hover:bg-[#131720]/40">
                  <td className="px-4 py-3 font-bold text-[#16D9FF]">{tc.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#F4F6FA]">
                    {tc.name}
                    <span className="block text-[10px] text-[#737D90]">rev {tc.version}</span>
                  </td>
                  <td className="px-4 py-3 text-[#A1A8B7]">{tc.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      tc.severity === 'CRITICAL' ? 'bg-[#FF233F]/15 text-[#FF233F] border border-[#FF233F]/30' :
                      tc.severity === 'HIGH' ? 'bg-[#FF7A45]/15 text-[#FF7A45] border border-[#FF7A45]/30' :
                      'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                    }`}>
                      {tc.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#737D90] text-[11px] max-w-xs">{tc.property}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => window.open('/red-team/playground', '_self')}
                      className="px-2.5 py-1 rounded bg-[#131720] hover:bg-[#FF233F] hover:text-white border border-[#39202A] text-[#16D9FF] text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Test in Lab →
                    </button>
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
