from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import AttackCreate, AttackOut, AttackPayloadOut, AttackLibraryItem
from app.services.red_service import RedService
from app.models.models import Attack, AttackPayload
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations/{id}/attacks", tags=["Red Team Workspace"])

@router.get("/library", response_model=List[AttackLibraryItem])
def get_attack_library():
    return RedService.get_attack_library()

@router.post("")
async def submit_attack(
    id: str,
    data: AttackCreate,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("red:submit_attack"))
):
    result = await RedService.submit_and_execute_attack(
        db=db,
        evaluation_id=id,
        prompt=data.prompt,
        category=data.category,
        severity=data.severity,
        system_context=data.system_context or "",
        submitted_by=actor.username
    )
    return result

@router.get("", response_model=List[AttackOut])
def list_attacks(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    attacks = (
        db.query(Attack)
        .filter(Attack.evaluation_id == id)
        .order_by(Attack.created_at.desc())
        .all()
    )
    return attacks

@router.get("/{attack_id}/payload", response_model=AttackPayloadOut)
def get_confidential_payload(
    id: str,
    attack_id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("red:read_payload"))
):
    """
    STRICT ZERO-TRUST BOUNDARY:
    Only Red Team and Admin users can retrieve the raw confidential exploit payload.
    Blue Team or Viewer requests will be rejected with 403 FORBIDDEN.
    """
    attack = db.query(Attack).filter(Attack.id == attack_id, Attack.evaluation_id == id).first()
    if not attack:
        raise HTTPException(status_code=404, detail=f"Attack {attack_id} not found")

    payload = db.query(AttackPayload).filter(AttackPayload.id == attack.payload_id).first()
    if not payload:
        raise HTTPException(status_code=404, detail="Payload record not found")

    return payload
