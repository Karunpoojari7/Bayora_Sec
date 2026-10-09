from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import EvidenceEventOut, EvidenceVerifyOut
from app.services.evidence_service import EvidenceService
from app.models.models import EvidenceEvent
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations/{id}/evidence", tags=["Evidence & Provenance"])

@router.get("", response_model=List[EvidenceEventOut])
def get_evidence_chain(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return EvidenceService.get_chain(db, id)

@router.post("/verify", response_model=EvidenceVerifyOut)
def verify_evidence_chain(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("evidence:verify"))
):
    return EvidenceService.verify_chain(db, id)

@router.post("/simulate-tamper")
def simulate_tampering(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("admin:all"))
):
    """
    DEMO FEATURE:
    Deliberately alters an evidence event's metadata to simulate an unauthorized
    database tampering attack. Demonstrates that the cryptographic hash chain
    detects the alteration immediately.
    """
    events = EvidenceService.get_chain(db, id)
    if not events or len(events) < 2:
        raise HTTPException(
            status_code=400,
            detail="Requires at least 2 events in evaluation to simulate tamper."
        )

    # Mutate event 1 metadata without recomputing hash
    target_event = events[1]
    target_event.metadata_json = {"tampered": True, "unauthorized_modification": "EXPLOIT_OVERWRITE"}
    db.commit()

    return {
        "status": "TAMPER_SIMULATED",
        "tampered_event_id": target_event.id,
        "tampered_event_seq": target_event.event_seq,
        "message": f"Event seq {target_event.event_seq} metadata modified in DB. Run /evidence/verify to observe detection."
    }
