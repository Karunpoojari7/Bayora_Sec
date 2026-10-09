# Bayora — Security Architecture

## 1. Zero-Trust Security Principles

1. **Never Trust Network Proximity**: Every component authenticates using cryptographic JWT bearer credentials or explicit capability headers (`X-Bayora-Capability`).
2. **Default Deny Egress**: Sandbox networks are marked `internal: true`. Containers cannot route directly to the Internet, the host network, or neighboring sandboxes.
3. **Information Barriers**: Sensitive attack payloads are segregated from general audit logs and Blue Team queries.
4. **Immutable Evidence Provenance**: Every security-relevant event produces a verifiable SHA-256 hash pointer.
5. **Least Privilege Container Profile**:
   - `no-new-privileges: true`
   - `cap_drop: [ALL]`
   - `read_only: true` (with isolated `tmpfs` mounts)
   - Non-root user execution (`USER 10001`)
   - Explicit CPU and memory quotas

---

## 2. Network Segmentation Matrix

| Source Network | Destination Network | Direct Traffic Policy | Brokered Path |
| :--- | :--- | :--- | :--- |
| `red_net` | `blue_net` | **BLOCKED (Default Deny)** | Gateway PEP/PDP only |
| `blue_net` | `red_net` | **BLOCKED (Default Deny)** | None |
| `red_net` | `llm_net` | **BLOCKED (Default Deny)** | Gateway PEP/PDP only |
| `red_net` | `data_net` (Postgres/Redis) | **BLOCKED (Default Deny)** | Gateway only |
| `blue_net` | `data_net` (Postgres/Redis) | **BLOCKED (Default Deny)** | Gateway only |
| `control_net` | Sandboxes | **ALLOWED (Broker)** | Internal Bridge |

---

## 3. RBAC & Capability Matrix

| Capability | ADMIN | RED_TEAM | BLUE_TEAM | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| `red:submit_attack` | ✓ | ✓ | ✕ | ✕ |
| `red:read_payload` | ✓ | ✓ | ✕ | ✕ |
| `blue:read_sanitized_results` | ✓ | ✕ | ✓ | ✓ |
| `blue:write_defense` | ✓ | ✕ | ✓ | ✕ |
| `blue:test_defense` | ✓ | ✕ | ✓ | ✕ |
| `evaluation:control` | ✓ | ✓ | ✓ | ✕ |
| `evidence:read` | ✓ | ✓ | ✓ | ✓ |
| `evidence:verify` | ✓ | ✕ | ✕ | ✕ |
| `admin:all` | ✓ | ✕ | ✕ | ✕ |
