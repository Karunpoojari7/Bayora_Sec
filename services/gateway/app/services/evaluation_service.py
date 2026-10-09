import random
import uuid
import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Evaluation, Defense
from app.services.evidence_service import EvidenceService

class EvaluationService:
    @staticmethod
    def generate_evaluation_id(db: Session = None) -> str:
        """Generates a unique evaluation ID like BAY-2026-00127 or BAY-2026-X981A."""
        for _ in range(50):
            seq = random.randint(10000, 99999)
            eval_id = f"BAY-2026-{seq:05d}"
            if db:
                if not db.query(Evaluation).filter(Evaluation.id == eval_id).first():
                    return eval_id
            else:
                return eval_id
        return f"BAY-2026-{uuid.uuid4().hex[:6].upper()}"

    @staticmethod
    def create_evaluation(
        db: Session,
        project_name: str,
        target_model: str = "llama3.2",
        model_version: str = "latest",
        evaluation_type: str = "adversarial_safety",
        description: str = "",
        risk_profile: str = "HIGH",
        created_by: str = "admin"
    ) -> Evaluation:
        eval_id = EvaluationService.generate_evaluation_id(db)
        eval_record = Evaluation(
            id=eval_id,
            project_name=project_name,
            target_model=target_model,
            model_version=model_version,
            evaluation_type=evaluation_type,
            description=description,
            risk_profile=risk_profile,
            status="READY",
            disclosure_state="RESTRICTED",
            created_by=created_by,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        db.add(eval_record)
        db.commit()
        db.refresh(eval_record)

        # 1. Log Genesis Evidence Event for this Evaluation
        EvidenceService.append_event(
            db=db,
            evaluation_id=eval_id,
            actor="CONTROL_PLANE",
            event_type="EVALUATION_INITIALIZED",
            metadata_json={
                "project_name": project_name,
                "target_model": target_model,
                "model_version": model_version,
                "evaluation_type": evaluation_type,
                "risk_profile": risk_profile
            }
        )

        # 2. Seed Baseline Blue Team Guardrails
        default_defenses = [
            Defense(
                id=f"DEF-INIT-1-{eval_id}",
                evaluation_id=eval_id,
                name="Instruction Fence: System Prompt Extraction Guard",
                rule_type="instruction_fence",
                pattern="reveal the protected system prompt",
                action="BLOCK",
                is_active=True,
                created_by="system_seed"
            ),
            Defense(
                id=f"DEF-INIT-2-{eval_id}",
                evaluation_id=eval_id,
                name="Keyword Guard: Jailbreak & Persona Switching",
                rule_type="keyword_filter",
                pattern="you are now evilbot",
                action="BLOCK",
                is_active=True,
                created_by="system_seed"
            ),
            Defense(
                id=f"DEF-INIT-3-{eval_id}",
                evaluation_id=eval_id,
                name="Canary Trap: Context Memory Leak Detector",
                rule_type="canary_trap",
                pattern="bayora-canary",
                action="QUARANTINE",
                is_active=True,
                created_by="system_seed"
            )
        ]
        for d in default_defenses:
            db.add(d)
        db.commit()

        return eval_record

    @staticmethod
    def get_evaluations(db: Session) -> List[Evaluation]:
        return db.query(Evaluation).order_by(Evaluation.created_at.desc()).all()

    @staticmethod
    def get_evaluation(db: Session, eval_id: str) -> Optional[Evaluation]:
        return db.query(Evaluation).filter(Evaluation.id == eval_id).first()

    @staticmethod
    def update_status(db: Session, eval_id: str, new_status: str, actor: str = "user") -> Evaluation:
        eval_record = db.query(Evaluation).filter(Evaluation.id == eval_id).first()
        if not eval_record:
            raise ValueError(f"Evaluation {eval_id} not found")

        old_status = eval_record.status
        eval_record.status = new_status
        eval_record.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(eval_record)

        EvidenceService.append_event(
            db=db,
            evaluation_id=eval_id,
            actor="CONTROL_PLANE",
            event_type="EVALUATION_STATUS_CHANGED",
            metadata_json={
                "old_status": old_status,
                "new_status": new_status,
                "changed_by": actor
            }
        )
        return eval_record
