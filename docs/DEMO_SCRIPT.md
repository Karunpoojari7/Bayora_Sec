# Bayora — 5-to-7 Minute Judge Demonstration Script

**Tagline**: *"Bayora doesn't just test whether an AI can be broken. Bayora proves whether the test itself can be trusted."*

---

## 1. Opening Narrative (Minute 0:00 – 1:00)
- **Problem**: When an AI safety benchmark claims a model is safe, can we trust that the testing environment wasn't contaminated, the test cases weren't leaked, and the evidence wasn't tampered with?
- **Solution**: Open `http://localhost:3000`. Introduce the **Bayora Zero-Trust Control Plane**. Point to the Live Test Flow (`RED -> POLICY GATEWAY -> TARGET LLM -> BLUE`).

---

## 2. Evaluation Project Setup (Minute 1:00 – 2:00)
1. Click **Evaluations** in the sidebar.
2. Click **NEW EVALUATION PROJECT**.
3. Create project: `Llama-3.2 Adversarial Safety Benchmark '26`.
4. Show issuance of unique Evaluation ID (e.g. `BAY-2026-00127`) and seeding of baseline guardrails and genesis evidence block.

---

## 3. Red Team Adversarial Attack & Confidential Vaulting (Minute 2:00 – 3:30)
1. Navigate to **Red Team Workspace**.
2. Select **System Prompt Extraction** from the Attack Library.
3. Click **LAUNCH ATTACK VECTOR**.
4. Show the response intercepted by the Policy Gateway (`BLOCKED`).
5. Show the confidential payload storage table.
6. Switch simulated role in top bar to **BLUE_TEAM**.
7. Navigate to **Blue Team Workspace**: Show that Blue Team sees only sanitized metadata and the SHA-256 payload hash (`e3b0c442...`). The raw attack prompt is completely hidden.
8. Attempt to click `REVEAL (RBAC)`: Show the modal immediately returns **ZERO-TRUST POLICY VIOLATION (403 FORBIDDEN)**.

---

## 4. Contamination Canary Check (Minute 3:30 – 4:30)
1. Navigate to **Contamination Center**.
2. Click **RUN CONTAMINATION CHECK**.
3. Point out the cryptographically unique canary token (`BAYORA-CANARY-...`).
4. Show the status: `✓ CLEAN (NO CONTAMINATION)`.
5. Explain that target model memory and prior session state were proven isolated.

---

## 5. Live Evidence Tampering Detection Demo (Minute 4:30 – 5:30)
1. Navigate to **Evidence Center**.
2. Show the SHA-256 Hash Chain (`EVENT 0 -> EVENT 1 -> EVENT 2...`).
3. Click **VERIFY CHAIN**: Show `✓ HASH CHAIN VALID`.
4. Click **SIMULATE TAMPER (DEMO)**: The system deliberately modifies an event in the database to simulate an insider attack.
5. Click **VERIFY CHAIN**: The UI immediately flags `⚠ TAMPERING DETECTED (SEQ #1)` with cryptographic proof of the corrupted hash pointer!

---

## 6. Flagship: Bayora Test Integrity Passport (Minute 5:30 – 6:30)
1. Navigate to **Trust Passport**.
2. Present the printable **Bayora Test Integrity Passport**:
   - Trust Score: `95 / 100` (HIGH CONFIDENCE)
   - Isolation: `✓ ENFORCED`
   - Contamination: `✓ CLEAN`
   - Evidence Integrity: `✓ VERIFIED`
   - Resource Fairness: `✓ GOVERNED`
   - Residual Risk Disclosures
   - Attestation Hash Pointer
3. Demonstrate **PRINT / SAVE PDF** and **EXPORT JSON**.

---

## 7. Closing Statement (Minute 6:30 – 7:00)
*"With Bayora, security teams and regulators no longer take AI safety reports on faith. We prove the integrity of the test."*
