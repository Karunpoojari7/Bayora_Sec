# Bayora — Deployment & Operations Guide

## 1. Prerequisites
- Docker & Docker Compose (v20+)
- Python 3.11+
- Node.js v18+ & npm
- (Optional) Local Ollama runtime (`ollama run llama3.2`)

---

## 2. Environment Configuration (`.env`)

Create a `.env` file from `.env.example`:
```bash
DATABASE_URL=postgresql://bayora:bayora_dev_only@postgres:5432/bayora
REDIS_URL=redis://redis:6379/0
RED_SHARED_TOKEN=red-demo-token
BLUE_SHARED_TOKEN=blue-demo-token
ADMIN_SHARED_TOKEN=admin-demo-token
LLM_URL=http://llm:8000
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
```

---

## 3. Running with Docker Compose

```bash
# Build and start all 7 zero-trust containers
docker compose up --build

# Verify container health
docker compose ps
```

Services exposed:
- **Bayora UI Dashboard**: `http://localhost:3000`
- **Gateway Control Plane API**: `http://localhost:8080` (or `http://localhost:8080/docs` for Swagger UI)
- **PostgreSQL Database**: `postgres:5432` (internal)
- **Redis Event Broker**: `redis:6379` (internal)

---

## 4. Running Tests

```bash
# Run security test suite
python tests/run_security_suite.py
```
