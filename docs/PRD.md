# Bayora — Product Requirements Document (PRD)

## 1. Executive Summary & Product Vision
**Bayora** is a Zero-Trust AI Safety Evaluation Infrastructure designed for **Hack in Hills '26 (Problem 04: Securing Adversarial AI Safety Testing Infrastructure)**.

Traditional AI red-teaming platforms ask: *"Can we break the model?"*  
**Bayora additionally asks:** ***"Can we trust the environment and evidence that produced the result?"***

Bayora provides a verifiable execution boundary where three actors operate concurrently:
1. **Red Team**: Executes controlled adversarial test cases against target LLMs.
2. **Target LLM**: Evaluated model running in an isolated execution sandbox.
3. **Blue Team**: Observes sanitized findings and validates defensive guardrails in real time without unauthorized exposure to raw exploit payloads.

The platform continuously measures:
$$\text{MODEL SAFETY} + \text{TEST INTEGRITY} = \text{TRUSTWORTHY AI EVALUATION}$$

---

## 2. Core Personas & Roles

| Role | Responsibility | Capabilities |
| :--- | :--- | :--- |
| **ADMIN** | Full governance, policy administration, tamper simulation | `admin:all`, `evaluation:control`, `trust:export` |
| **RED_TEAM** | Attack scenario creation, exploit execution | `red:submit_attack`, `red:read_payload`, `evaluation:control` |
| **BLUE_TEAM** | Defense guardrail engineering, sanitized telemetry analysis | `blue:read_sanitized_results`, `blue:write_defense`, `blue:test_defense` |
| **VIEWER** | Independent audit, compliance verification | `evidence:read`, `trust:read` |

---

## 3. Product Workflows

### 3.1 Project Creation & Initialization
- User defines project name, target model runtime (`llama3.2`, `phi3`, or Mock provider), risk profile (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), and description.
- System issues a unique Evaluation ID (e.g., `BAY-2026-00127`).
- A genesis event is appended to the SHA-256 hash chain, and baseline guardrails are seeded.

### 3.2 Controlled Adversarial Testing (Red Team Workspace)
- Pre-curated attack scenario library covering:
  - Prompt Injection
  - Instruction Override
  - Context Manipulation
  - Role Confusion (DAN / Persona hijacking)
  - System Prompt Extraction
  - Tool Abuse Simulation
  - Data Exfiltration
  - Multi-Turn Adversarial Sequences
- Raw attack payloads are encrypted/vaulted in a separate table (`attack_payloads`).
- Blue Team queries receive only sanitized metadata (`payload_hash`, `category`, `result_class`).
- UI allows authorized Red Team/Admin operators to click `REVEAL PAYLOAD` with strict RBAC enforcement.

### 3.3 Defensive Studio & Guardrail Testing (Blue Team Workspace)
- Create active defense rules (`keyword_filter`, `regex_guard`, `instruction_fence`, `canary_trap`).
- Define enforcement actions (`BLOCK`, `REDACT`, `QUARANTINE`).
- Test defense rules in real time against arbitrary test vectors.

### 3.4 Cryptographic Evidence Center
- Every evaluation lifecycle event, attack execution, policy match, and contamination test generates a cryptographically linked SHA-256 evidence record.
- Hash chaining algorithm:
  $$\text{event\_hash} = \text{SHA256}(\text{id} \parallel \text{eval\_id} \parallel \text{actor} \parallel \text{type} \parallel \text{timestamp} \parallel \text{canonical\_meta\_hash} \parallel \text{prev\_hash})$$
- Verification endpoint recalculates all hashes from Genesis to Tip.
- Built-in tamper simulation proves that any unauthorized database alteration is detected immediately.

### 3.5 Cross-Session Contamination Center
- Generates cryptographically unique canary tokens (`BAYORA-CANARY-<UUID>`).
- Validates that target session context is isolated and memory is purged on reset.
- Verifies that Test A cannot leak context or canaries into Test B.

### 3.6 Resource Fairness & Quota Governance
- Monitors CPU, RAM, request counts, and execution latency across actors.
- Computes a dynamic Resource Fairness Indicator (0–100).
- Enforces rate limits to prevent noisy-neighbor attacks.

### 3.7 Bayora Test Integrity Passport
- Generates the official downloadable & printable cryptographic certificate summarizing:
  - Evaluation ID & Model Identity
  - Isolation Boundary Status (Enforced)
  - Contamination Status (Clean)
  - Evidence Chain Status (Valid)
  - Resource Fairness Score
  - Multi-Factor Trust Score (0–100) & Trust Tier
  - Residual Risk Disclosures
  - Cryptographic Passport Hash
