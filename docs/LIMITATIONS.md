# Bayora — Security Assumptions & Known Limitations

## 1. Explicit Architectural Limitations

1. **Container vs Hardware Boundary**:
   - Bayora uses hardened Docker containers (`no-new-privileges`, `cap_drop: ALL`, `read_only: true`, `non-root user 10001`, `internal: true` networks).
   - Docker container isolation is a kernel namespace boundary, NOT a confidential VM (e.g., AMD SEV-SNP or Intel TDX).
   - A host kernel compromise or hypervisor breakout is outside the scope of container-level isolation.

2. **Hardware Microarchitectural Timing Channels**:
   - The Resource Governor measures elapsed execution duration and CPU/RAM allocation fairness.
   - However, timing side channels caused by shared hardware CPU cache lines or GPU memory buses cannot be eliminated without dedicated physical hardware isolation.

3. **Local Development Secrets**:
   - In production, capabilities and secrets should be provisioned via hardware KMS / Vault. The demo environment uses `.env` configuration.

---

## 2. Phase-2 Hardening Roadmap

1. **Confidential Virtual Machines (CVMs)**: Transition sandboxes from Docker containers to confidential microVMs (Kata Containers / Firecracker with AMD SEV-SNP).
2. **Cryptographic Key Attestation**: Integration with Hardware Security Modules (HSM) for signing evaluation passports.
3. **Statistical Timing Leakage Detection**: Automated ANOVA and t-test measurement to detect micro-timing leakage during adversarial multi-turn sessions.
4. **Automated Red Team Mutation Engine**: Dynamic genetic and gradient-based adversarial jailbreak generation against target models.
