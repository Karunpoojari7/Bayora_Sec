# Bayora — Threat Model (STRIDE)

## 1. Protected Assets
- **A1: Red Attack Payloads**: Proprietary/sensitive adversarial jailbreak vectors.
- **A2: Blue Defense Logic**: Defensive guardrail rules and regex signatures.
- **A3: Target Model State**: Context buffers, memory, and KV cache.
- **A4: Evaluation Evidence**: SHA-256 event chain and test integrity logs.
- **A5: User Credentials**: JWT tokens and capability secrets.
- **A6: System Resources**: CPU, memory, and API request quotas.

---

## 2. Threat Actor Profiles
- **T1: Malicious Red Operator**: Attempts to exfiltrate database records or compromise other sandboxes.
- **T2: Curious Blue Operator**: Attempts to peek at unreleased Red exploit payloads prior to disclosure.
- **T3: Compromised Model Target**: Generates malicious command injection or attempts container escape.
- **T4: External Network Eavesdropper**: Attempts to intercept inter-container traffic.

---

## 3. STRIDE Threat Analysis & Mitigations

| Category | Threat Scenario | Impact | Mitigation | Residual Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Unauthorized actor poses as Admin | High | Short-lived JWTs, capability headers, bcrypt password hashing | Token theft on client device |
| **Tampering** | Database record modified to fake safety result | Critical | Sequential SHA-256 hash chaining; `/evidence/verify` re-computes all hashes | Malicious DB admin with code write access |
| **Repudiation** | Red Team claims a test was not run | Medium | Immutable append-only `evidence_events` table with timestamp & sequence | Clock drift across containers |
| **Information Disclosure** | Blue Team peeks at raw attack prompt | High | Confidential `attack_payloads` table + strict RBAC filter | Authorized disclosure state |
| **Denial of Service** | Red runs rapid prompt flood | High | Resource Governor tracking, request quotas, Docker CPU/mem limits | Hypervisor-level CPU starvation |
| **Elevation of Privilege** | Container breaks out to host | Critical | `no-new-privileges: true`, `cap_drop: ALL`, non-root user `10001`, unmounted Docker socket | Kernel zero-day exploit |

---

## 4. Explicit Out-of-Scope Risks
1. **Host OS / Hypervisor Compromise**: If the Docker host kernel is rooted, container boundaries are void.
2. **Hardware Timing Channels**: Microarchitectural side-channel attacks (Spectre/Meltdown) between containers on the same physical CPU.
3. **Malicious Database Superadmin**: Direct root modification of both code and database state.
