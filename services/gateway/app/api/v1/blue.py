from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import (
    BlueViewOut, DefenseCreate, DefenseOut, DefenseTestReq,
    DefenseTestResult, SecurityFindingOut, RegressionTestReq,
    RegressionTestOut, DisclosureRequestCreate, DisclosureRequestOut,
    DisclosureReviewReq
)
from app.services.blue_service import BlueService
from app.models.models import Defense, SecurityFinding, DisclosureRequest
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations/{id}", tags=["Blue Team Workspace"])

@router.get("/blue-view", response_model=BlueViewOut)
def get_blue_view(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:read_sanitized_results"))
):
    try:
        return BlueService.get_blue_view(db, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/defenses", response_model=DefenseOut, status_code=status.HTTP_201_CREATED)
def create_defense(
    id: str,
    data: DefenseCreate,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:write_defense"))
):
    return BlueService.create_defense(
        db=db,
        evaluation_id=id,
        name=data.name,
        rule_type=data.rule_type,
        pattern=data.pattern,
        action=data.action,
        created_by=actor.username
    )

@router.get("/defenses", response_model=List[DefenseOut])
def list_defenses(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return (
        db.query(Defense)
        .filter(Defense.evaluation_id == id)
        .order_by(Defense.version.desc())
        .all()
    )

@router.post("/defenses/{defense_id}/test", response_model=DefenseTestResult)
def test_defense(
    id: str,
    defense_id: str,
    data: DefenseTestReq,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:test_defense"))
):
    try:
        return BlueService.test_defense(db, id, defense_id, data.test_input)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/regression-test", response_model=RegressionTestOut)
def run_regression_comparison(
    id: str,
    data: RegressionTestReq,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:test_defense"))
):
    return BlueService.run_regression_comparison(
        db=db,
        evaluation_id=id,
        version_a=data.policy_version_a,
        version_b=data.policy_version_b
    )

@router.post("/disclosure-request", response_model=DisclosureRequestOut)
def request_disclosure(
    id: str,
    data: DisclosureRequestCreate,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:request_disclosure"))
):
    return BlueService.request_disclosure(
        db=db,
        evaluation_id=id,
        attack_id=data.attack_id,
        requested_by=actor.username,
        justification=data.justification
    )

@router.post("/disclosure-requests/{req_id}/review")
def review_disclosure(
    id: str,
    req_id: str,
    data: DisclosureReviewReq,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("blue:approve_disclosure"))
):
    req = db.query(DisclosureRequest).filter(DisclosureRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Disclosure request not found")
    req.status = data.status
    import datetime
    req.reviewed_by = actor.username
    req.reviewed_at = datetime.datetime.utcnow()
    db.commit()
    return {"status": req.status, "request_id": req_id}

@router.get("/findings", response_model=List[SecurityFindingOut])
def list_findings(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return (
        db.query(SecurityFinding)
        .filter(SecurityFinding.evaluation_id == id)
        .order_by(SecurityFinding.created_at.desc())
        .all()
    )
