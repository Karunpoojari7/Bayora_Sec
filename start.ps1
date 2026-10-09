# Bayora One-Click Startup Script (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  BAYORA ZERO-TRUST AI EVALUATION INFRASTRUCTURE" -ForegroundColor Cyan
Write-Host "  Kickstarting Full Stack (Docker Compose)..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Docker daemon is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Building and starting all zero-trust containers..." -ForegroundColor Yellow
docker compose up --build -d

Write-Host "[2/3] Waiting for Gateway to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "[3/3] Checking service health..." -ForegroundColor Yellow
$health = curl -s http://localhost:8080/health
Write-Host "Gateway Health: $health" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  [✓] BAYORA STACK READY!" -ForegroundColor Green
Write-Host "  - Frontend UI:        http://localhost:3000" -ForegroundColor White
Write-Host "  - Gateway API Docs:   http://localhost:8080/docs" -ForegroundColor White
Write-Host "  - Gateway Health:     http://localhost:8080/health" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "To run the automated security verification suite:" -ForegroundColor White
Write-Host "  python tests/run_security_suite.py" -ForegroundColor Yellow
