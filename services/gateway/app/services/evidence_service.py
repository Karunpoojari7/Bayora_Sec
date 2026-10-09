import datetime
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.models import EvidenceEvent
from app.security.crypto import compute_evidence_hash, canonical_json_hash
import logging

logger = logging.getLogger("bayora.evidence")

GENESIS_PREVIOUS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

class EvidenceService:
    @staticmethod
    def append_event(
        db: Session,
        evaluation_id: str,
        actor: str,
        event_type: str,
        metadata_json: Dict[str, Any]
    ) -> EvidenceEvent:
        """
        Appends an event to the SHA-256 hash chain for an evaluation.
        Ensures strict chronological chaining and tamper-evidence.
        """
        # Get the latest event for this evaluation
        latest_event = (
            db.query(EvidenceEvent)
            .filter(EvidenceEvent.evaluation_id == evaluation_id)
            .order_by(EvidenceEvent.event_seq.desc())
            .first()
        )

        if latest_event is None:
            event_seq = 0
            previous_hash = GENESIS_PREVIOUS_HASH
        else:
            event_seq = latest_event.event_seq + 1
            previous_hash = latest_event.event_hash

        event_id = f"EVT-{uuid.uuid4().hex[:12].upper()}"
        timestamp = datetime.datetime.utcnow()
        timestamp_str = timestamp.isoformat()

        event_hash = compute_evidence_hash(
            event_id=event_id,
            evaluation_id=evaluation_id,
            actor=actor,
            event_type=event_type,
            timestamp_str=timestamp_str,
            metadata_json=metadata_json,
            previous_event_hash=previous_hash
        )

        event = EvidenceEvent(
            id=event_id,
            evaluation_id=evaluation_id,
            event_seq=event_seq,
            actor=actor,
            event_type=event_type,
            metadata_json=metadata_json,
            previous_event_hash=previous_hash,
            event_hash=event_hash,
            timestamp=timestamp
        )

        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_chain(db: Session, evaluation_id: str) -> List[EvidenceEvent]:
        return (
            db.query(EvidenceEvent)
            .filter(EvidenceEvent.evaluation_id == evaluation_id)
            .order_by(EvidenceEvent.event_seq.asc())
            .all()
        )

    @staticmethod
    def verify_chain(db: Session, evaluation_id: str) -> Dict[str, Any]:
        """
        Independently recomputes all SHA-256 hashes from Genesis to Tip.
        Detects any tampering, mutation, deletion, or reordering of events.
        """
        events = EvidenceService.get_chain(db, evaluation_id)
        if not events:
            return {
                "evaluation_id": evaluation_id,
                "is_valid": True,
                "total_events": 0,
                "genesis_hash": GENESIS_PREVIOUS_HASH,
                "tip_hash": GENESIS_PREVIOUS_HASH,
                "tampered_event_seq": None,
                "verification_message": "No events recorded yet (Genesis chain valid)",
                "verified_at": datetime.datetime.utcnow()
            }

        expected_previous_hash = GENESIS_PREVIOUS_HASH
        for idx, event in enumerate(events):
            # 1. Verify sequence order
            if event.event_seq != idx:
                return {
                    "evaluation_id": evaluation_id,
                    "is_valid": False,
                    "total_events": len(events),
                    "genesis_hash": events[0].event_hash,
                    "tip_hash": events[-1].event_hash,
                    "tampered_event_seq": event.event_seq,
                    "verification_message": f"Sequence discontinuity detected at index {idx}, found seq {event.event_seq}",
                    "verified_at": datetime.datetime.utcnow()
                }

            # 2. Verify previous hash pointer
            if event.previous_event_hash != expected_previous_hash:
                return {
                    "evaluation_id": evaluation_id,
                    "is_valid": False,
                    "total_events": len(events),
                    "genesis_hash": events[0].event_hash,
                    "tip_hash": events[-1].event_hash,
                    "tampered_event_seq": event.event_seq,
                    "verification_message": f"Chain linkage broken at event {event.id} (seq {event.event_seq}). Expected previous hash {expected_previous_hash}, got {event.previous_event_hash}",
                    "verified_at": datetime.datetime.utcnow()
                }

            # 3. Recompute event hash
            timestamp_str = event.timestamp.isoformat()
            recomputed_hash = compute_evidence_hash(
                event_id=event.id,
                evaluation_id=event.evaluation_id,
                actor=event.actor,
                event_type=event.event_type,
                timestamp_str=timestamp_str,
                metadata_json=event.metadata_json,
                previous_event_hash=expected_previous_hash
            )

            if recomputed_hash != event.event_hash:
                return {
                    "evaluation_id": evaluation_id,
                    "is_valid": False,
                    "total_events": len(events),
                    "genesis_hash": events[0].event_hash,
                    "tip_hash": events[-1].event_hash,
                    "tampered_event_seq": event.event_seq,
                    "verification_message": f"Cryptographic integrity violation! Event {event.id} (seq {event.event_seq}) content has been altered. Computed: {recomputed_hash}, Stored: {event.event_hash}",
                    "verified_at": datetime.datetime.utcnow()
                }

            expected_previous_hash = event.event_hash

        return {
            "evaluation_id": evaluation_id,
            "is_valid": True,
            "total_events": len(events),
            "genesis_hash": events[0].event_hash,
            "tip_hash": events[-1].event_hash,
            "tampered_event_seq": None,
            "verification_message": f"Evidence chain verified cryptographically valid across {len(events)} immutable events.",
            "verified_at": datetime.datetime.utcnow()
        }
