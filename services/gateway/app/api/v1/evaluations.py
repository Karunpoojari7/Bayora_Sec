from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import EvaluationCreate, EvaluationOut, EvaluationUpdate
from app.services.evaluation_service import EvaluationService
from app.services.trust_service import TrustService
from app.services.evidence_service import EvidenceService
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])

@router.post("", response_model=EvaluationOut, status_code=status.HTTP_201_CREATED)
def create_evaluation(
    data: EvaluationCreate,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evaluation:create"))
):
    return EvaluationService.create_evaluation(
        db=db,
        project_name=data.project_name,
        target_model=data.target_model,
        model_version=data.model_version,
        evaluation_type=data.evaluation_type,
        description=data.description or "",
        risk_profile=data.risk_profile,
        created_by=actor.username
    )

@router.get("", response_model=List[EvaluationOut])
def list_evaluations(
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return EvaluationService.get_evaluations(db)

@router.get("/{id}", response_model=EvaluationOut)
def get_evaluation(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    eval_record = EvaluationService.get_evaluation(db, id)
    if not eval_record:
        raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")
    return eval_record

@router.post("/{id}/start")
def start_evaluation(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evaluation:control"))
):
    return EvaluationService.update_status(db, id, "RUNNING", actor.username)

@router.post("/{id}/pause")
def pause_evaluation(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evaluation:control"))
):
    return EvaluationService.update_status(db, id, "PAUSED", actor.username)

@router.post("/{id}/resume")
def resume_evaluation(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evaluation:control"))
):
    return EvaluationService.update_status(db, id, "RUNNING", actor.username)

@router.post("/{id}/terminate")
def terminate_evaluation(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evaluation:control"))
):
    return EvaluationService.update_status(db, id, "COMPLETED", actor.username)

@router.get("/{id}/dashboard")
def get_evaluation_dashboard(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    eval_record = EvaluationService.get_evaluation(db, id)
    if not eval_record:
        raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")

    trust_passport = TrustService.generate_passport(db, id)
    evidence_status = EvidenceService.verify_chain(db, id)

    return {
        "evaluation": eval_record,
        "passport": trust_passport,
        "evidence_integrity": evidence_status
    }
