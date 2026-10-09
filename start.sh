#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  BAYORA ZERO-TRUST AI EVALUATION INFRASTRUCTURE"
echo "  Kickstarting Full Stack (Docker Compose)..."
echo "=========================================================="

if ! docker info > /dev/null 2>&1; then
    echo "[!] Docker daemon is not running. Please start Docker first."
    exit 1
fi

echo "[1/3] Building and starting all zero-trust containers..."
docker compose up --build -d

echo "[2/3] Waiting for Gateway to be ready..."
sleep 5

echo "[3/3] Checking service health..."
curl -s http://localhost:8080/health || true

echo ""
echo "=========================================================="
echo "  [✓] BAYORA STACK READY!"
echo "  - Frontend UI:        http://localhost:3000"
echo "  - Gateway API Docs:   http://localhost:8080/docs"
echo "  - Gateway Health:     http://localhost:8080/health"
echo "=========================================================="
echo "To run the automated security verification suite:"
echo "  python tests/run_security_suite.py"
