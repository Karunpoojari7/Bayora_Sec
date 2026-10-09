# Bayora — System Design

## 1. Zero-Trust Architecture Diagram

```mermaid
graph TD
    UI[Bayora Web UI - React + Vite] -->|HTTPS / REST| GW[FastAPI Gateway & Policy Engine]
    
    subgraph Control_Plane[Bayora Zero-Trust Control Plane]
        GW --> PEP[Policy Enforcement Point]
        PEP --> PDP[Policy Decision Point]
        GW --> EE[Evidence Engine SHA-256]
        GW --> CE[Contamination Engine]
        GW --> RG[Resource Governor]
        GW --> TS[Trust Scoring & Passport]
    end

    subgraph Red_Sandbox[Isolated Red Network: red_net]
        RS[Red Team Test Runner]
        RS -.->|No Direct Route| BS
        RS -.->|No Direct Route| TL
    end

    subgraph Blue_Sandbox[Isolated Blue Network: blue_net]
        BS[Blue Team Defensive Studio]
    end

    subgraph LLM_Sandbox[Isolated LLM Network: llm_net]
        TL[Target LLM Provider Proxy]
        TL --> OLLAMA[Ollama Runtime / Local Models]
        TL --> MOCK[Mock LLM Fallback]
    end

    subgraph Data_Tier[Isolated Data Network: data_net]
        PG[(PostgreSQL 16)]
        RD[(Redis 7)]
    end

    GW -->|Broker| RS
    GW -->|Broker| BS
    GW -->|Broker| TL
    GW -->|Persist| PG
    GW -->|Cache & Stream| RD
```

---

## 2. Core Execution Flow

1. **Test Initiation**: Red Team selects or constructs an adversarial payload.
2. **Confidential Vaulting**: Raw payload text is saved to `attack_payloads` table. The SHA-256 hash is generated and linked.
3. **Policy Gate Evaluation**: Gateway tests active Blue Team defenses against the prompt.
4. **Target Execution**: If not blocked by policy, the Gateway routes the prompt to the isolated Target LLM session.
5. **Telemetry Sanitization**: Model response classification is logged. Raw prompts are never sent to Blue Team channels.
6. **Evidence Chaining**: A new SHA-256 evidence block is chained to the evaluation's chronological ledger.
7. **Resource Accounting**: Execution latency and resource allocations are recorded.
8. **Trust Attestation**: Trust Score is dynamically recomputed and passport hash is updated.
