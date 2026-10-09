from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ContaminationCheckOut, ContaminationCheckReq
from app.services.contamination_service import ContaminationService
from app.models.models import ContaminationCheck
from app.security.rbac import require_capability, AuthContext, get_current_actor

router = APIRouter(prefix="/evaluations/{id}/contamination", tags=["Contamination Testing"])

@router.post("/check", response_model=ContaminationCheckOut)
async def run_contamination_check(
    id: str,
    req: ContaminationCheckReq = None,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("contamination:check"))
):
    session_id = req.session_id if req else None
    probe_query = req.probe_query if req else None
    return await ContaminationService.run_contamination_check(
        db=db,
        evaluation_id=id,
        session_id=session_id,
        custom_probe=probe_query
    )

@router.get("/checks", response_model=List[ContaminationCheckOut])
def list_contamination_checks(
    id: str,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(get_current_actor)
):
    return (
        db.query(ContaminationCheck)
        .filter(ContaminationCheck.evaluation_id == id)
        .order_by(ContaminationCheck.created_at.desc())
        .all()
    )
