# Bayora — UI/UX Design System Specification

## 1. Aesthetic Direction: Enterprise Cybersecurity Operations Console
- **Background Palette**: Near-black obsidian (`#080C14`), dark slate card containers (`#0D1424`), border lines (`#1E293B`).
- **Primary Accent**: Electric Blue (`#2563EB`) and Cyan (`#06B6D4`).
- **Status Indicators**:
  - Safe / Verified: Emerald (`#10B981`)
  - Warning / Review: Amber (`#F59E0B`)
  - Threat / Tampering: Rose (`#EF4444`)
- **Typography**: Inter (Body/Headings) + JetBrains Mono (Evaluation IDs, SHA-256 Hashes, Code, Capabilities).

---

## 2. Key Interface Views

1. **Executive Dashboard**: High-level posture, active evaluation summary, interactive Live Test Flow visualizer (`RED -> GATEWAY -> TARGET -> BLUE`), Trust Meter, and findings feed.
2. **Evaluations Center**: Project initialization modal, evaluation state management (`READY`, `RUNNING`, `PAUSED`, `TERMINATE`, `RESET`).
3. **Red Team Workspace**: Attack library selector, custom adversarial prompt generator, confidential payload vaulting indicator, and RBAC-controlled payload reveal dialog.
4. **Blue Team Studio**: Information barrier indicator, defensive rule builder, live defense rule sandbox, and sanitized findings.
5. **Target LLM Sandbox**: Model runtime detector (Ollama vs Mock), session memory context purge trigger, and controlled inference probe.
6. **Evidence Center**: Sequential SHA-256 Hash Chain visualizer with cryptographic link badges, verify trigger, and simulated tamper trigger.
7. **Contamination Center**: Canary probe runner, cross-session verification, and leakage audit table.
8. **Resource Governor**: Resource fairness indicator (0–100) and actor quota distribution.
9. **Test Integrity Passport (Flagship)**: Full cryptographic passport with attestation seals, watermark, print/PDF export, and JSON download.
10. **Settings & RBAC**: Actor role simulator (`ADMIN`, `RED_TEAM`, `BLUE_TEAM`, `VIEWER`), capability matrix, and container security profiles.
