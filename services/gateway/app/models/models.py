import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Text, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String(64), primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), default="VIEWER", nullable=False) # ADMIN, RED_TEAM, BLUE_TEAM, MODEL_OPERATOR, VIEWER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(64), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")

class Role(Base):
    __tablename__ = "roles"
    id = Column(String(64), primary_key=True)
    name = Column(String(32), unique=True, nullable=False)
    description = Column(String(256))

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(String(64), primary_key=True)
    name = Column(String(64), unique=True, nullable=False)
    description = Column(String(256))

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(String(64), primary_key=True, index=True) # e.g. BAY-2026-00127
    project_name = Column(String(128), nullable=False)
    target_model = Column(String(64), nullable=False, default="llama3.2")
    model_version = Column(String(32), default="latest")
    evaluation_type = Column(String(64), default="adversarial_safety")
    description = Column(Text, default="")
    risk_profile = Column(String(32), default="CRITICAL") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="READY", index=True) # DRAFT, READY, RUNNING, PAUSED, COMPLETED, FAILED, QUARANTINED
    disclosure_state = Column(String(32), default="RESTRICTED") # RESTRICTED, AUTHORIZED_DISCLOSURE, PUBLIC
    current_policy_version = Column(Integer, default=1)
    created_by = Column(String(64), default="admin")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    attacks = relationship("Attack", back_populates="evaluation", cascade="all, delete-orphan")
    defenses = relationship("Defense", back_populates="evaluation", cascade="all, delete-orphan")
    findings = relationship("SecurityFinding", back_populates="evaluation", cascade="all, delete-orphan")
    evidence_events = relationship("EvidenceEvent", back_populates="evaluation", cascade="all, delete-orphan")
    contamination_checks = relationship("ContaminationCheck", back_populates="evaluation", cascade="all, delete-orphan")
    resource_metrics = relationship("ResourceMetric", back_populates="evaluation", cascade="all, delete-orphan")
    trust_scores = relationship("TrustScore", back_populates="evaluation", cascade="all, delete-orphan")
    disclosure_requests = relationship("DisclosureRequest", back_populates="evaluation", cascade="all, delete-orphan")

class EvaluationMember(Base):
    __tablename__ = "evaluation_members"
    id = Column(String(64), primary_key=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String(32), nullable=False)

class AttackPayload(Base):
    """
    CONFIDENTIAL PAYLOAD STORAGE:
    Separated from general metadata. Accessible only by authorized Red Team/Admin
    or during an explicit authorized disclosure state.
    """
    __tablename__ = "attack_payloads"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    prompt_text = Column(Text, nullable=False)
    system_context = Column(Text, default="")
    multi_turn_context = Column(JSON, default=list)
    payload_hash = Column(String(64), nullable=False, index=True) # SHA-256
    created_by = Column(String(64), default="red_team")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Attack(Base):
    """
    Sanitized attack record visible in general dashboards and blue team queries.
    Never contains raw sensitive prompt unless authorized.
    """
    __tablename__ = "attacks"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    payload_id = Column(String(64), ForeignKey("attack_payloads.id"), nullable=False)
    payload_hash = Column(String(64), nullable=False, index=True)
    category = Column(String(64), nullable=False, default="prompt_injection") 
    severity = Column(String(32), default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="EXECUTED") # PENDING, EXECUTED, BLOCKED, FAILED
    result_class = Column(String(32), default="UNKNOWN") # GATEWAY_BLOCKED, DEFENSE_FILTERED, MODEL_REFUSED, POTENTIAL_VIOLATION, ALLOWED
    policy_version = Column(Integer, default=1)
    latency_ms = Column(Float, default=0.0)
    submitted_by = Column(String(64), default="red_team")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    evaluation = relationship("Evaluation", back_populates="attacks")
    payload = relationship("AttackPayload")
    runs = relationship("ModelRun", back_populates="attack", cascade="all, delete-orphan")

class ModelRun(Base):
    __tablename__ = "model_runs"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    attack_id = Column(String(64), ForeignKey("attacks.id"), nullable=True, index=True)
    session_id = Column(String(64), nullable=False, index=True)
    prompt_hash = Column(String(64), nullable=False)
    response_text = Column(Text, default="")
    result_class = Column(String(32), default="ALLOWED")
    tokens_in = Column(Integer, default=0)
    tokens_out = Column(Integer, default=0)
    latency_ms = Column(Float, default=0.0)
    provider_name = Column(String(32), default="mock")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    attack = relationship("Attack", back_populates="runs")

class Defense(Base):
    __tablename__ = "defenses"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    rule_type = Column(String(64), default="keyword_filter") # keyword_filter, regex_guard, semantic_boundary, instruction_fence, canary_trap
    pattern = Column(Text, nullable=False)
    action = Column(String(32), default="BLOCK") # BLOCK, REDACT, QUARANTINE, LOG
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_by = Column(String(64), default="blue_team")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    evaluation = relationship("Evaluation", back_populates="defenses")

class DisclosureRequest(Base):
    """
    Authorized workflow for Blue Team to request access to raw confidential attack payload.
    Must be reviewed and approved by Admin / Red Lead.
    """
    __tablename__ = "disclosure_requests"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    attack_id = Column(String(64), ForeignKey("attacks.id"), nullable=False, index=True)
    requested_by = Column(String(64), nullable=False)
    justification = Column(Text, nullable=False)
    status = Column(String(32), default="PENDING") # PENDING, APPROVED, REJECTED
    reviewed_by = Column(String(64), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    evaluation = relationship("Evaluation", back_populates="disclosure_requests")

class SecurityFinding(Base):
    __tablename__ = "security_findings"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    title = Column(String(128), nullable=False)
    category = Column(String(64), nullable=False)
    severity = Column(String(32), default="HIGH")
    description = Column(Text, default="")
    sanitized_metadata = Column(JSON, default=dict)
    status = Column(String(32), default="OPEN") # OPEN, MITIGATED, ACCEPTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    evaluation = relationship("Evaluation", back_populates="findings")

class ContaminationCheck(Base):
    __tablename__ = "contamination_checks"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    session_id = Column(String(64), nullable=False)
    canary_token = Column(String(128), nullable=False)
    probe_query = Column(Text, nullable=False)
    target_response = Column(Text, default="")
    is_clean = Column(Boolean, default=True)
    isolation_status = Column(String(32), default="ISOLATED") # ISOLATED, CONTAMINATED, RESIDUAL_STATE
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    evaluation = relationship("Evaluation", back_populates="contamination_checks")

class ResourceMetric(Base):
    __tablename__ = "resource_metrics"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    actor = Column(String(32), nullable=False) # RED, BLUE, TARGET_LLM, GATEWAY
    cpu_usage_pct = Column(Float, default=0.0)
    memory_mb = Column(Float, default=0.0)
    request_count = Column(Integer, default=1)
    latency_ms = Column(Float, default=0.0)
    duration_ms = Column(Float, default=0.0)
    fairness_score = Column(Float, default=100.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    evaluation = relationship("Evaluation", back_populates="resource_metrics")

class EvidenceEvent(Base):
    __tablename__ = "evidence_events"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    event_seq = Column(Integer, nullable=False)
    actor = Column(String(32), nullable=False) # SYSTEM, RED, BLUE, LLM, POLICY
    event_type = Column(String(64), nullable=False, index=True)
    metadata_json = Column(JSON, default=dict)
    previous_event_hash = Column(String(64), nullable=False)
    event_hash = Column(String(64), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    evaluation = relationship("Evaluation", back_populates="evidence_events")

    __table_args__ = (
        Index("idx_eval_seq", "evaluation_id", "event_seq"),
    )

class TrustScore(Base):
    __tablename__ = "trust_scores"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), ForeignKey("evaluations.id"), nullable=False, index=True)
    isolation_score = Column(Float, default=100.0) # 25%
    evidence_score = Column(Float, default=100.0)  # 20%
    contamination_score = Column(Float, default=100.0) # 20%
    fairness_score = Column(Float, default=100.0)  # 15%
    access_score = Column(Float, default=100.0)    # 10%
    observability_score = Column(Float, default=100.0) # 10%
    overall_score = Column(Float, default=100.0)
    trust_tier = Column(String(32), default="HIGH CONFIDENCE") # HIGH RISK, NEEDS REVIEW, TRUSTED, HIGH CONFIDENCE
    passport_hash = Column(String(64), nullable=False)
    residual_risk = Column(String(32), default="LOW")
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    evaluation = relationship("Evaluation", back_populates="trust_scores")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String(64), primary_key=True, index=True)
    evaluation_id = Column(String(64), index=True, nullable=True)
    user_id = Column(String(64), default="anonymous")
    action = Column(String(64), nullable=False)
    status = Column(String(32), default="SUCCESS")
    ip_address = Column(String(64), default="127.0.0.1")
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
