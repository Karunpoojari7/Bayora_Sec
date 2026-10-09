import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, Filter, Search } from 'lucide-react';
import { AttackLibraryItem } from '../../types';
import { api } from '../../services/api';

interface TestLibraryPageProps {
  evaluationId: string;
}

export const TestLibraryPage: React.FC<TestLibraryPageProps> = ({ evaluationId }) => {
  const [library, setLibrary] = useState<AttackLibraryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (evaluationId) {
      loadLibrary();
    }
  }, [evaluationId]);

  const loadLibrary = async () => {
    try {
      const items = await api.getAttackLibrary(evaluationId);
      setLibrary(items);
    } catch (e) {}
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = library.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.sample_prompt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold font-mono text-slate-900">ADVERSARIAL TEST CASE LIBRARY</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-bold">
            STANDARD TEST VECTORS
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Curated catalog of jailbreaks, instruction overrides, system extraction attacks, and synthetic secret probes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test vectors by name, prompt, or vector description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-mono text-slate-900 bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-500">CATEGORY:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 rounded-lg px-2.5 py-1"
          >
            <option value="ALL">All Categories ({library.length})</option>
            <option value="prompt_injection">Prompt Injection</option>
            <option value="instruction_override">Instruction Override</option>
            <option value="system_prompt_extraction">System Prompt Extraction</option>
            <option value="data_exfiltration">Data Exfiltration</option>
            <option value="tool_abuse">Tool Abuse Simulation</option>
          </select>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-subtle space-y-3 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{item.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                    {item.severity}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-blue-700 font-semibold mt-0.5">{item.category}</div>
              </div>

              <button
                onClick={() => handleCopy(item.id, item.sample_prompt)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {item.sample_prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
