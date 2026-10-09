from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import InferenceReq, InferenceOut, SessionResetReq, SessionResetOut
from app.services.llm_provider import get_active_llm_provider
from app.services.policy_engine import PolicyEngine
from app.security.rbac import require_capability, AuthContext, get_current_actor
import datetime
import uuid

router = APIRouter(prefix="/evaluations/{id}", tags=["Target LLM Gateway"])

@router.post("/inference", response_model=InferenceOut)
async def evaluate_inference(
    id: str,
    req: InferenceReq,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("red:evaluate"))
):
    session_id = req.session_id or f"sess_{id}_{uuid.uuid4().hex[:6]}"
    
    if req.apply_defenses:
        is_blocked, action, rule_name, processed_prompt, latency = PolicyEngine.evaluate_prompt(
            db=db,
            evaluation_id=id,
            prompt=req.prompt
        )
        if is_blocked:
            return InferenceOut(
                response=f"Request blocked by policy rule '{rule_name}'.",
                result_class="BLOCKED",
                blocked_by=rule_name,
                latency_ms=latency,
                provider_name="PolicyEngine",
                tokens_in=len(req.prompt.split()),
                tokens_out=6,
                session_id=session_id
            )
    else:
        processed_prompt = req.prompt

    provider = await get_active_llm_provider()
    res = await provider.generate(processed_prompt, session_id=session_id, system_prompt=req.system_prompt)
    
    return InferenceOut(
        response=res.get("response", ""),
        result_class=res.get("result_class", "ALLOWED"),
        blocked_by=None,
        latency_ms=res.get("latency_ms", 0.0),
        provider_name=res.get("provider", "mock"),
        tokens_in=res.get("tokens_in", len(req.prompt.split())),
        tokens_out=res.get("tokens_out", 10),
        session_id=session_id
    )

@router.post("/reset", response_model=SessionResetOut)
async def reset_model_session(
    id: str,
    req: SessionResetReq = None,
    actor: AuthContext = Depends(require_capability("evaluation:control"))
):
    session_id = req.session_id if req and req.session_id else f"sess_{id}"
    provider = await get_active_llm_provider()
    await provider.reset_session(session_id)

    return SessionResetOut(
        evaluation_id=id,
        session_id=session_id,
        status="RESET_SUCCESS",
        message="Target model session memory and context successfully cleared.",
        timestamp=datetime.datetime.utcnow()
    )

@router.get("/llm-health")
async def get_llm_health():
    provider = await get_active_llm_provider()
    return await provider.health()
