# Bayora — Technical Requirements Document (TRD)

## 1. System Architecture Overview

```
                      +-----------------------------+
                      |         BAYORA UI           |
                      |   React 18 + Vite + Tailwind |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    GATEWAY CONTROL PLANE    |
                      |     FastAPI (Port 8000)     |
                      +--------------+--------------+
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
       v                             v                             v
+--------------+              +--------------+              +--------------+
| RED SANDBOX  |              |  TARGET LLM  |              | BLUE SANDBOX |
| Python 3.12  |              | Ollama/Mock  |              | Python 3.12  |
| (red_net)    |              |  (llm_net)   |              |  (blue_net)  |
+--------------+              +-------+------+              +--------------+
                                      |
                                      v
                             +-----------------+
                             |  LOCAL OLLAMA   |
                             | llama3.2 / phi3 |
                             +-----------------+
```

---

## 2. Technology Stack

- **Backend & Control Plane**: Python 3.12, FastAPI, Pydantic V2, SQLAlchemy ORM, bcrypt, python-jose, httpx.
- **Database & Persistence**: PostgreSQL 16 (Alpine) with automated SQLite fallback for local test execution.
- **Cache & Task Infrastructure**: Redis 7 (Alpine) for task state and event streaming.
- **Frontend Console**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Container Infrastructure**: Docker, Docker Compose with isolated bridge networks (`red_net`, `blue_net`, `llm_net`, `data_net`, `control_net`).

---

## 3. Core Subsystems

### 3.1 Policy Enforcement Point (PEP) & Decision Point (PDP)
- Centralized FastAPI gateway intercepts all inbound attack vectors.
- Evaluates active Blue Team defense rules prior to forwarding to LLM.
- Enforces RBAC permissions via JWT bearer tokens and `X-Bayora-Capability` headers.

### 3.2 Pluggable LLMProvider Abstraction
- Abstract Base Class: `LLMProvider` (`generate()`, `reset_session()`, `health()`).
- Concrete Implementations:
  - `OllamaProvider`: Native HTTP integration with local Ollama daemon (`/api/chat` and `/api/generate`).
  - `MockLLMProvider`: Deterministic adversarial simulator for CI/CD and air-gapped test suites.

### 3.3 Cryptographic Evidence Engine
- Implements SHA-256 hash chaining.
- Genesis event has `previous_event_hash = "0000000000000000000000000000000000000000000000000000000000000000"`.
- Verification endpoint recalculates all hashes in $O(N)$ time, detecting any sequence alteration, field mutation, or event omission.

### 3.4 Contamination Testing Engine
- Generates cryptographically unique canary tokens (`BAYORA-CANARY-<UUID>`).
- Implements isolated session contexts (`sess_<evaluation_id>_<uuid>`).
- Performs probe queries across sessions and validates state destruction after `/reset`.

### 3.5 Resource Governor & Trust Scoring
- Tracks CPU, memory, request frequency, and latency.
- Calculates Multi-Factor Bayora Trust Score:
  $$\text{Trust Score} = 0.25(\text{Isolation}) + 0.20(\text{Evidence}) + 0.20(\text{Contamination}) + 0.15(\text{Fairness}) + 0.10(\text{RBAC}) + 0.10(\text{Audit})$$
