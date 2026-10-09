# BAYORA — Zero-Trust AI Safety Evaluation Infrastructure

> **Hack in Hills '26 — Problem 04: Securing Adversarial AI Safety Testing Infrastructure**  
> *"Bayora doesn't just test whether an AI can be broken. Bayora proves whether the test itself can be trusted."*

---

## 🛡️ Executive Summary

Traditional AI security platforms focus solely on whether a model can be jailbroken. **Bayora** secures the **environment** where AI safety testing takes place, establishing verifiable trust across three concurrent actors:

1. **Red Team**: Executes controlled adversarial tests without leaking sensitive exploit payloads to unauthorized parties.
2. **Target LLM**: Runs in an isolated runtime environment with cryptographic canary tracking and state-purge mechanisms.
3. **Blue Team**: Builds and validates defensive guardrails using sanitized telemetry without seeing raw attack prompts prior to authorized disclosure.

---

## 🏛️ Core Architecture & Topology

```
                         ┌──────────────────────────┐
                         │       BAYORA UI          │
                         │   React 18 + Tailwind    │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     BAYORA CONTROL       │
                         │         PLANE            │
                         │  FastAPI PEP/PDP Gateway │
                         └────────────┬─────────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │                 │                  │
                    ▼                 ▼                  ▼
             ┌────────────┐    ┌────────────┐    ┌────────────┐
             │ RED        │    │ TARGET LLM │    │ BLUE       │
             │ SANDBOX    │    │ SANDBOX    │    │ SANDBOX    │
             │ (red_net)  │    │  (llm_net) │    │ (blue_net) │
             └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
                   │                  │                  │
                   └──────────────────┼──────────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   EVIDENCE ENGINE        │
                         │  SHA-256 Hash Chain      │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                 ┌──────────────┐          ┌──────────────┐
                 │ CONTAMINATION│          │ RESOURCE     │
                 │ ENGINE       │          │ FAIRNESS     │
                 └──────┬───────┘          └──────┬───────┘
                        │                          │
                        └────────────┬─────────────┘
                                     ▼
                         ┌──────────────────────────┐
                         │ BAYORA TRUST SCORE       │
                         │                          │
                         │ TEST INTEGRITY PASSPORT  │
                         └──────────────────────────┘
```

---

## 🚀 Quick Start (Docker Compose)

### 1. Start the Full Stack
```bash
docker compose up --build
```

### 2. Access the Application
- **Bayora Security Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Gateway API & Swagger Docs**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Health Check**: [http://localhost:8080/health](http://localhost:8080/health)

### 3. Run Automated Security Verification Suite
```bash
python tests/run_security_suite.py
```

---

## 🏆 Key Features

- **Test Integrity Passport**: Downloadable and printable cryptographic attestation certifying model identity, boundary enforcement, zero contamination, and hash chain provenance.
- **Confidential Payload Storage**: Red Team exploits are vaulted in encrypted tables; Blue Team views receive only SHA-256 hashes until authorized disclosure.
- **Canary Contamination Engine**: Detects context leakage and proves target LLM memory is cleanly destroyed between evaluations.
- **SHA-256 Evidence Hash Chain**: Tamper-evident ledger with live tamper simulation and instant verification.
- **Ollama + Mock LLMProvider**: Seamless integration with local models (`llama3.2`, `phi3`) with automatic fallback to high-speed deterministic mock simulator for air-gapped CI.

---

## 📚 Documentation Index

- [Architecture Decisions (ADR)](docs/ARCHITECTURE_DECISIONS.md)
- [Product Requirements Document (PRD)](docs/PRD.md)
- [Technical Requirements Document (TRD)](docs/TRD.md)
- [System Design](docs/SYSTEM_DESIGN.md)
- [Security Architecture](docs/SECURITY_ARCHITECTURE.md)
- [Threat Model (STRIDE)](docs/THREAT_MODEL.md)
- [REST API Specification](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [UI/UX Design Guide](docs/UI_UX.md)
- [Automated Test Plan](docs/TEST_PLAN.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Judge Demonstration Script](docs/DEMO_SCRIPT.md)
- [Known Limitations & Roadmap](docs/LIMITATIONS.md)
