# Bayora Architecture Decisions (ADR)

## ADR-001: Separation of Control Plane, Gateway, and Actor Sandboxes
- **Context**: Adversarial safety testing requires simultaneous operations by Red Team, Blue Team, and Target LLMs without state leakage, cross-talk, or unauthorized network access.
- **Decision**: The FastAPI Gateway acts as the zero-trust Policy Enforcement Point (PEP) and Policy Decision Point (PDP). Sandboxes (Red, Blue, Target LLM) reside on strictly isolated Docker internal networks (`red_net`, `blue_net`, `llm_net`, `data_net`). Direct sandbox-to-sandbox and sandbox-to-database communication is prohibited at the network level (`internal: true`).
- **Status**: Accepted.

## ADR-002: Modular LLMProvider Abstraction with Ollama & Mock Fallback
- **Context**: The evaluation environment must support local open-weight models via Ollama while operating reliably even if Ollama is not running in CI or test environments.
- **Decision**: Implement an abstract base class `LLMProvider` with concrete implementations:
  1. `OllamaProvider`: Connects to `OLLAMA_BASE_URL` with configurable `OLLAMA_MODEL` and dynamic model availability detection.
  2. `MockLLMProvider`: High-speed deterministic fallback provider for testing, air-gapped CI, and simulated vulnerability suites.
- **Status**: Accepted.

## ADR-003: Cryptographic Evidence Hash Chaining (SHA-256)
- **Context**: To answer "Can we trust the experiment?", every evaluation event must be tamper-evident and cryptographically verifiable.
- **Decision**: Implement an immutable-style event store where each event calculates:
  `event_hash = SHA256(event_id + evaluation_id + actor + event_type + timestamp + metadata_canonical_json + previous_event_hash)`
  The API provides an `/evidence/verify` endpoint that recalculates and checks the chain integrity from genesis to the current tip.
- **Status**: Accepted.

## ADR-004: Canary-Based Cross-Session Contamination Engine
- **Context**: Multi-test evaluations must ensure Test A cannot leak prompt context, KV cache data, or system prompt clues into Test B.
- **Decision**: Each test run generates a cryptographically unique canary token (`BAYORA-<UUID>`) and an isolated evaluation session ID. The contamination engine executes canary probe queries and inspects model attention/output to verify that target state resets cleanly between evaluations.
- **Status**: Accepted.

## ADR-005: Confidential Payload Storage & Red-vs-Blue Information Barriers
- **Context**: Red Team adversarial prompts contain sensitive exploit techniques. Blue Team must be able to view sanitized attack metadata and response classifications to build defenses without leaking raw payloads prematurely.
- **Decision**: Sensitive payloads are stored in a dedicated `attack_payloads` table with strict RBAC. Generic endpoints return sanitized metadata (`payload_hash`, `category`, `severity`, `status`). Full payload disclosure requires explicit capability authorization or reaching the authorized disclosure evaluation state.
- **Status**: Accepted.

## ADR-006: Bayora Trust Score & Test Integrity Passport
- **Context**: Traditional tools only score model vulnerability. Bayora must quantify the integrity of the evaluation environment itself.
- **Decision**: Calculate a weighted multi-factor Trust Score (0–100):
  - Isolation & Network Boundaries (25%)
  - Evidence Chain Integrity (20%)
  - Contamination Resistance (20%)
  - Resource Fairness & Governance (15%)
  - Access Control & RBAC (10%)
  - Observability & Audit Completeness (10%)
  Produce a verifiable **Bayora Test Integrity Passport** summarizing model identity, isolation status, evidence hash, and residual risk tiers.
- **Status**: Accepted.
