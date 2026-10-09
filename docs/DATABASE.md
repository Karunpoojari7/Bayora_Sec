# Bayora — Database Schema Specification

PostgreSQL 16 Schema (Relational Architecture)

## 1. Table Definitions

### 1. `users`
- `id` (VARCHAR(64), Primary Key)
- `username` (VARCHAR(64), Unique, Indexed)
- `email` (VARCHAR(128), Unique)
- `hashed_password` (VARCHAR(256))
- `role` (VARCHAR(32), Default: 'VIEWER')
- `is_active` (BOOLEAN, Default: true)
- `created_at` (TIMESTAMP)

### 2. `evaluations`
- `id` (VARCHAR(64), Primary Key, e.g. `BAY-2026-00127`)
- `project_name` (VARCHAR(128))
- `target_model` (VARCHAR(64))
- `model_version` (VARCHAR(32))
- `evaluation_type` (VARCHAR(64))
- `description` (TEXT)
- `risk_profile` (VARCHAR(32))
- `status` (VARCHAR(32), Indexed: `DRAFT`, `READY`, `RUNNING`, `PAUSED`, `COMPLETED`, `FAILED`, `QUARANTINED`)
- `disclosure_state` (VARCHAR(32), Default: 'RESTRICTED')
- `created_by` (VARCHAR(64))
- `created_at` (TIMESTAMP, Indexed)
- `updated_at` (TIMESTAMP)

### 3. `attack_payloads` *(CONFIDENTIAL VAULT)*
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `prompt_text` (TEXT, Raw confidential exploit)
- `system_context` (TEXT)
- `payload_hash` (VARCHAR(64), SHA-256)
- `created_by` (VARCHAR(64))
- `created_at` (TIMESTAMP)

### 4. `attacks` *(SANITIZED METADATA)*
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `payload_id` (VARCHAR(64), Foreign Key -> `attack_payloads.id`)
- `payload_hash` (VARCHAR(64), Indexed)
- `category` (VARCHAR(64))
- `severity` (VARCHAR(32))
- `status` (VARCHAR(32))
- `result_class` (VARCHAR(32))
- `latency_ms` (FLOAT)
- `submitted_by` (VARCHAR(64))
- `created_at` (TIMESTAMP, Indexed)

### 5. `defenses`
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `name` (VARCHAR(128))
- `rule_type` (VARCHAR(64))
- `pattern` (TEXT)
- `action` (VARCHAR(32))
- `is_active` (BOOLEAN)
- `created_by` (VARCHAR(64))
- `created_at` (TIMESTAMP)

### 6. `evidence_events` *(IMMUTABLE HASH CHAIN)*
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`, Indexed)
- `event_seq` (INTEGER, Indexed)
- `actor` (VARCHAR(32))
- `event_type` (VARCHAR(64), Indexed)
- `metadata_json` (JSONB / JSON)
- `previous_event_hash` (VARCHAR(64))
- `event_hash` (VARCHAR(64), Indexed)
- `timestamp` (TIMESTAMP, Indexed)

### 7. `contamination_checks`
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `session_id` (VARCHAR(64))
- `canary_token` (VARCHAR(128))
- `probe_query` (TEXT)
- `target_response` (TEXT)
- `is_clean` (BOOLEAN)
- `isolation_status` (VARCHAR(32))
- `details` (JSON)
- `created_at` (TIMESTAMP)

### 8. `resource_metrics`
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `actor` (VARCHAR(32))
- `cpu_usage_pct` (FLOAT)
- `memory_mb` (FLOAT)
- `request_count` (INTEGER)
- `latency_ms` (FLOAT)
- `fairness_score` (FLOAT)
- `timestamp` (TIMESTAMP)

### 9. `trust_scores`
- `id` (VARCHAR(64), Primary Key)
- `evaluation_id` (VARCHAR(64), Foreign Key -> `evaluations.id`)
- `isolation_score` (FLOAT)
- `evidence_score` (FLOAT)
- `contamination_score` (FLOAT)
- `fairness_score` (FLOAT)
- `access_score` (FLOAT)
- `observability_score` (FLOAT)
- `overall_score` (FLOAT)
- `trust_tier` (VARCHAR(32))
- `passport_hash` (VARCHAR(64))
- `residual_risk` (VARCHAR(32))
- `calculated_at` (TIMESTAMP)
