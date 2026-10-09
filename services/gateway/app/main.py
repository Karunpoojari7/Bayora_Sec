import time
import logging
from fastapi import FastAPI, Request, status, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.models.models import Evaluation, Attack, Defense, User
from app.services.auth_service import AuthService
from app.services.evaluation_service import EvaluationService
from app.services.red_service import RedService
from app.services.blue_service import BlueService
from app.services.evidence_service import EvidenceService
from app.services.contamination_service import ContaminationService
from app.services.trust_service import TrustService
from app.services.llm_provider import get_active_llm_provider

# Import V1 Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.evaluations import router as eval_router
from app.api.v1.red import router as red_router
from app.api.v1.blue import router as blue_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.contamination import router as contamination_router
from app.api.v1.trust import router as trust_router
from app.api.v1.llm import router as llm_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("bayora.gateway")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bayora Zero-Trust AI Safety Evaluation Control Plane",
    version="1.0.0",
    description="Enterprise Infrastructure for Verifiable Adversarial AI Safety Testing"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial data on startup
@app.on_event("startup")
def startup_event():
    logger.info("Initializing Bayora Zero-Trust Control Plane...")
    db = next(get_db())
    try:
        AuthService.seed_default_users(db)
        # Create an initial demo evaluation if none exist
        if db.query(Evaluation).count() == 0:
            eval_record = EvaluationService.create_evaluation(
                db=db,
                project_name="Llama-3.2 Safety Benchmark '26",
                target_model="llama3.2",
                model_version="3.2.1-instruct",
                evaluation_type="adversarial_safety",
                description="Zero-trust baseline evaluation against prompt injection and instruction override.",
                risk_profile="CRITICAL",
                created_by="admin"
            )
            # Seed an initial contamination check
            logger.info(f"Initialized demo evaluation: {eval_record.id}")
    finally:
        db.close()

# Request tracking middleware
@app.middleware("http")
async def add_security_headers_and_logging(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000
    response.headers["X-Bayora-Control-Plane"] = "v1.0-zero-trust"
    response.headers["X-Process-Time-Ms"] = str(round(process_time, 2))
    return response

# Custom Structured Exception Handler
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    if isinstance(detail, dict) and "error" in detail:
        return JSONResponse(status_code=exc.status_code, content=detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "REQUEST_ERROR", "message": str(detail)}}
    )

# Register V1 API routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(eval_router, prefix=settings.API_V1_STR)
app.include_router(red_router, prefix=settings.API_V1_STR)
app.include_router(blue_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)
app.include_router(contamination_router, prefix=settings.API_V1_STR)
app.include_router(trust_router, prefix=settings.API_V1_STR)
app.include_router(llm_router, prefix=settings.API_V1_STR)

# --- Legacy & Sandbox Compatibility Endpoints ---

@app.get("/health")
def health():
    return {"service": "bayora-gateway", "status": "healthy", "version": "1.0.0"}

@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    try:
        user_count = db.query(User).count()
        return {"service": "bayora-gateway", "status": "ready", "database": "connected", "users": user_count}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database not ready: {e}")

@app.post("/tests")
def legacy_create_test(db: Session = Depends(get_db)):
    """Legacy endpoint for compatibility with original demo script."""
    eval_rec = EvaluationService.create_evaluation(
        db=db,
        project_name="Phase1-Adversarial-Eval",
        target_model="llama3.2",
        created_by="legacy_client"
    )
    return {"test_id": eval_rec.id, "status": "READY"}

@app.post("/tests/{test_id}/red/attack")
async def legacy_red_attack(
    test_id: str,
    payload: dict,
    x_bayora_capability: str = Header(None, alias="X-Bayora-Capability"),
    db: Session = Depends(get_db)
):
    """Legacy endpoint for services/red/red.py."""
    if x_bayora_capability != settings.RED_SHARED_TOKEN and x_bayora_capability != settings.ADMIN_SHARED_TOKEN:
        raise HTTPException(status_code=403, detail="Unauthorized capability for red attack")
    
    prompt = payload.get("prompt", "")
    result = await RedService.submit_and_execute_attack(
        db=db,
        evaluation_id=test_id,
        prompt=prompt,
        submitted_by="red_sandbox"
    )
    return result

@app.get("/tests/{test_id}/blue-view")
def legacy_blue_view(
    test_id: str,
    x_bayora_capability: str = Header(None, alias="X-Bayora-Capability"),
    db: Session = Depends(get_db)
):
    """Legacy endpoint for services/blue/blue.py."""
    if x_bayora_capability != settings.BLUE_SHARED_TOKEN and x_bayora_capability != settings.ADMIN_SHARED_TOKEN:
        raise HTTPException(status_code=403, detail="Unauthorized capability for blue view")
    
    return BlueService.get_blue_view(db, test_id)

@app.get("/report")
def legacy_report(db: Session = Depends(get_db)):
    latest_eval = db.query(Evaluation).order_by(Evaluation.created_at.desc()).first()
    if not latest_eval:
        return {"report": "No evaluations recorded"}
    evidence_status = EvidenceService.verify_chain(db, latest_eval.id)
    passport = TrustService.generate_passport(db, latest_eval.id)
    return {
        "evaluation_id": latest_eval.id,
        "evidence_tip_hash": evidence_status.get("tip_hash"),
        "evidence_chain_valid": evidence_status.get("is_valid"),
        "trust_score": passport.get("trust_score"),
        "trust_tier": passport.get("trust_tier")
    }

@app.post("/contamination-check")
async def legacy_contamination_check(payload: dict = None, db: Session = Depends(get_db)):
    latest_eval = db.query(Evaluation).order_by(Evaluation.created_at.desc()).first()
    eval_id = (payload.get("test_id") if payload else None) or (latest_eval.id if latest_eval else "BAY-2026-00001")
    check = await ContaminationService.run_contamination_check(db, eval_id)
    return {
        "test_id": eval_id,
        "canary": check.canary_token,
        "present": not check.is_clean,
        "status": check.isolation_status
    }
