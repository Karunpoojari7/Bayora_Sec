from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import TestIntegrityPassportOut, ResourceFairnessOut, TrustScoreBreakdown
from app.services.trust_service import TrustService
from app.services.governor_service import ResourceGovernorService
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations/{id}", tags=["Trust & Test Integrity Passport"])

@router.get("/trust-score")
def get_trust_score(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("trust:read"))
):
    score = TrustService.calculate_trust_score(db, id)
    return {
        "evaluation_id": id,
        "overall_score": score.overall_score,
        "trust_tier": score.trust_tier,
        "breakdown": {
            "isolation_score": score.isolation_score,
            "evidence_score": score.evidence_score,
            "contamination_score": score.contamination_score,
            "fairness_score": score.fairness_score,
            "access_score": score.access_score,
            "observability_score": score.observability_score
        },
        "passport_hash": score.passport_hash,
        "residual_risk": score.residual_risk,
        "calculated_at": score.calculated_at
    }

@router.get("/passport", response_model=TestIntegrityPassportOut)
def get_test_integrity_passport(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("trust:read"))
):
    try:
        return TrustService.generate_passport(db, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/fairness", response_model=ResourceFairnessOut)
def get_resource_fairness(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return ResourceGovernorService.get_fairness_summary(db, id)
