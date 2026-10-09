# Bayora — Automated Test Plan & Acceptance Matrix

## 1. 12 Critical Architectural Security Tests

| # | Test Name | Target Guarantee | Verification Method | Result |
| :-: | :--- | :--- | :--- | :---: |
| **1** | Red -> Blue Network Isolation | Red sandbox cannot directly connect to Blue sandbox | Docker `internal: true` bridge verification | **PASS** |
| **2** | Blue -> Red Network Isolation | Blue sandbox cannot directly connect to Red sandbox | Docker bridge isolation verification | **PASS** |
| **3** | Red -> Postgres Isolation | Red sandbox cannot reach PostgreSQL database | Network attachment verification | **PASS** |
| **4** | Blue -> Postgres Isolation | Blue sandbox cannot reach PostgreSQL database | Network attachment verification | **PASS** |
| **5** | Capability-Based RBAC | Unauthorized roles are denied privileged operations | Matrix evaluation: 401/403 checks | **PASS** |
| **6** | Confidential Payload Redaction | Raw Red payloads are redacted from Blue Team view | Database vault check + Blue query inspection | **PASS** |
| **7** | Canary Cross-Session Isolation | Test A canaries do not leak into Test B context | Unique token generation & probe verification | **PASS** |
| **8** | Evidence Hash Chain Tamper Detection | Any modified event causes verification failure | Direct database record mutation simulation | **PASS** |
| **9** | Resource Governor Fairness | Prevents uncontrolled resource consumption | Fairness index score computation | **PASS** |
| **10**| Target Session Context Reset | Context memory destroyed upon session reset | LLMProvider session memory lifecycle test | **PASS** |
| **11**| Policy Gateway Interception | Active defenses drop forbidden adversarial vectors | Policy engine evaluation test | **PASS** |
| **12**| Test Integrity Passport Attestation | Issues verifiable cryptographic passport | End-to-end evaluation & passport check | **PASS** |

---

## 2. Test Execution Commands

```bash
# Execute full security test suite with machine-readable output
python tests/run_security_suite.py

# Execute pytest suite
pytest -v tests/test_bayora_security.py
```
