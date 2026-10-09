import React from 'react';
import { Key, Check, X, Shield, Lock, Info } from 'lucide-react';

export const RbacPage: React.FC = () => {
  const capabilities = [
    { cap: 'red:execute', label: 'Submit Attack Probes / Campaigns', desc: 'Execute adversarial inputs against evaluation targets' },
    { cap: 'red:read_library', label: 'Access Adversarial Test Library', desc: 'Inspect OWASP LLM and specialized prompt vectors' },
    { cap: 'red:read_confidential_payload', label: 'Inspect Raw Red Team Exploit Payloads', desc: 'Access unredacted attack strings' },
    { cap: 'blue:read_sanitized_results', label: 'View Sanitized Security Telemetry', desc: 'Real-time alert queue with redacted vectors' },
    { cap: 'blue:write_defense', label: 'Create & Modify Defense Policies', desc: 'Author regex, instruction fences, and canary traps' },
    { cap: 'blue:test_defense', label: 'Execute Policy Regression Simulator', desc: 'Benchmark candidate defenses against test cases' },
    { cap: 'blue:request_disclosure', label: 'Request Audited Payload Disclosure', desc: 'Submit cryptographic reveal requests for RCAs' },
    { cap: 'model:operate', label: 'Direct Model Inference Playground', desc: 'Interactive prompt engineering and session resets' },
    { cap: 'model:check_contamination', label: 'Run Canary Contamination Checks', desc: 'Inject and verify session boundary markers' },
    { cap: 'eval:create', label: 'Create & Initialize Evaluations', desc: 'Spin up new evaluation sandboxes and target LLMs' },
    { cap: 'eval:control', label: 'Lifecycle Controls (Pause/Resume/Stop)', desc: 'Manage evaluation execution states' },
    { cap: 'evidence:verify', label: 'Verify Merkle Evidence Root', desc: 'Recompute cryptographic hash chains' },
    { cap: 'admin:manage_users', label: 'Provision Users & Assign Roles', desc: 'Platform account governance' },
  ];

  const roles = [
    {
      role: 'ADMIN',
      label: 'Administrator',
      caps: ['red:execute', 'red:read_library', 'red:read_confidential_payload', 'blue:read_sanitized_results', 'blue:write_defense', 'blue:test_defense', 'blue:request_disclosure', 'model:operate', 'model:check_contamination', 'eval:create', 'eval:control', 'evidence:verify', 'admin:manage_users']
    },
    {
      role: 'RED_TEAM',
      label: 'Red Team',
      caps: ['red:execute', 'red:read_library', 'red:read_confidential_payload', 'model:operate', 'evidence:verify']
    },
    {
      role: 'BLUE_TEAM',
      label: 'Blue Team',
      caps: ['blue:read_sanitized_results', 'blue:write_defense', 'blue:test_defense', 'blue:request_disclosure', 'evidence:verify']
    },
    {
      role: 'MODEL_OPERATOR',
      label: 'Model Operator',
      caps: ['model:operate', 'model:check_contamination', 'evidence:verify']
    },
    {
      role: 'AUDITOR',
      label: 'Auditor',
      caps: ['blue:read_sanitized_results', 'evidence:verify']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Capability Matrix</h2>
          <p className="text-slate-500 text-sm mt-1">
            Server-enforced cryptographic authorization matrix. Every API endpoint enforces mandatory capability verification.
          </p>
        </div>
      </div>

      {/* Security Architecture Guarantee */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Cryptographic Server Enforcement:</span> Client-side role variables cannot elevate privileges. The FastAPI gateway cryptographically parses the JWT signature and enforces explicit capability checks on every single HTTP and WebSocket route.
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            Granular Permission Matrix
          </span>
          <span className="text-xs text-slate-400">13 Core Capabilities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="px-4 py-3 min-w-[240px]">Permission / Capability</th>
                {roles.map(r => (
                  <th key={r.role} className="px-4 py-3 text-center">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capabilities.map((c) => (
                <tr key={c.cap} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{c.label}</div>
                    <div className="font-mono text-xs text-blue-600 font-medium">{c.cap}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>
                  </td>
                  {roles.map(r => {
                    const hasCap = r.caps.includes(c.cap);
                    return (
                      <td key={r.role} className="px-4 py-3.5 text-center">
                        {hasCap ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-400 rounded-full">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
