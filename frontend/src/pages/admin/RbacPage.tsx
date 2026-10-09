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
      color: '#00A3FF',
      caps: ['red:execute', 'red:read_library', 'red:read_confidential_payload', 'blue:read_sanitized_results', 'blue:write_defense', 'blue:test_defense', 'blue:request_disclosure', 'model:operate', 'model:check_contamination', 'eval:create', 'eval:control', 'evidence:verify', 'admin:manage_users']
    },
    {
      role: 'RED_TEAM',
      label: 'Red Team',
      color: '#FF3D59',
      caps: ['red:execute', 'red:read_library', 'red:read_confidential_payload', 'model:operate', 'evidence:verify']
    },
    {
      role: 'BLUE_TEAM',
      label: 'Blue Team',
      color: '#00D6B5',
      caps: ['blue:read_sanitized_results', 'blue:write_defense', 'blue:test_defense', 'blue:request_disclosure', 'evidence:verify']
    },
    {
      role: 'MODEL_OPERATOR',
      label: 'Model Operator',
      color: '#A56BFF',
      caps: ['model:operate', 'model:check_contamination', 'evidence:verify']
    },
    {
      role: 'AUDITOR',
      label: 'Auditor',
      color: '#7FB6E8',
      caps: ['blue:read_sanitized_results', 'evidence:verify']
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F4F8FF] tracking-tight">Roles & Capability Matrix</h1>
          <p className="text-[#718BA6] text-xs mt-1">
            Server-enforced cryptographic authorization matrix. Every API endpoint enforces mandatory capability verification.
          </p>
        </div>
      </div>

      {/* Security Architecture Guarantee */}
      <div className="bg-[#071729] border border-[#087BDA] p-4 rounded-xl flex items-start gap-3 shadow-[0_0_12px_rgba(8,123,218,0.2)]">
        <Lock className="w-5 h-5 text-[#00A3FF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#A9C2DA] leading-relaxed">
          <span className="font-bold text-[#EAF4FF]">Cryptographic Server Enforcement:</span> Client-side role variables cannot elevate privileges. The FastAPI gateway cryptographically parses the JWT signature and enforces explicit capability checks on every single HTTP and WebSocket route.
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#071729] rounded-xl border border-[#12324F] shadow-card overflow-hidden">
        <div className="p-4 border-b border-[#10283E] font-semibold text-[#F4F8FF] text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#00A3FF]" />
            Granular Permission Matrix
          </span>
          <span className="text-xs text-[#718BA6] font-mono">13 Core Capabilities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0C2137] text-[#718BA6] font-mono font-bold text-[10px] uppercase border-b border-[#12324F]">
                <th className="py-3 px-4 min-w-[280px]">Permission / Capability</th>
                {roles.map(r => (
                  <th key={r.role} className="py-3 px-4 text-center font-bold" style={{ color: r.color }}>
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10283E] font-mono">
              {capabilities.map((c) => (
                <tr key={c.cap} className="hover:bg-[#0B2C4C]/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-[#F4F8FF] text-xs">{c.label}</div>
                    <div className="font-mono text-[11px] text-[#7FB6E8] font-medium mt-0.5">{c.cap}</div>
                    <div className="text-[11px] text-[#718BA6] mt-0.5">{c.desc}</div>
                  </td>
                  {roles.map(r => {
                    const hasCap = r.caps.includes(c.cap);
                    return (
                      <td key={r.role} className="py-3.5 px-4 text-center">
                        {hasCap ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-[#0A2926] text-[#00D6B5] border border-[#00D6B5]/40 rounded-full font-bold shadow-[0_0_8px_rgba(0,214,181,0.25)]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-[#061321] text-[#52657A] border border-[#12324F] rounded-full">
                            <X className="w-3 h-3" />
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
