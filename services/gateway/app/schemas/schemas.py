import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# --- User & Auth Schemas ---
class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "VIEWER" # ADMIN, RED_TEAM, BLUE_TEAM, MODEL_OPERATOR, VIEWER

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime.datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    role: str
    user_id: str
    username: str
    capabilities: List[str]

class RefreshTokenReq(BaseModel):
    refresh_token: str

# --- Evaluation Schemas ---
class EvaluationCreate(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    project_name: str
    target_model: str = "llama3.2"
    model_version: str = "latest"
    evaluation_type: str = "adversarial_safety"
    description: Optional[str] = ""
    risk_profile: str = "HIGH" # LOW, MEDIUM, HIGH, CRITICAL

class EvaluationUpdate(BaseModel):
    project_name: Optional[str] = None
    description: Optional[str] = None
    risk_profile: Optional[str] = None
    status: Optional[str] = None
    disclosure_state: Optional[str] = None

class EvaluationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())
    id: str
    project_name: str
    target_model: str
    model_version: str
    evaluation_type: str
    description: Optional[str]
    risk_profile: str
    status: str
    disclosure_state: str
    current_policy_version: int
    created_by: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

# --- Red Team & Attack Schemas ---
class AttackCreate(BaseModel):
    prompt: str
    category: str = "prompt_injection"
    severity: str = "HIGH"
    system_context: Optional[str] = ""
    multi_turn_history: Optional[List[Dict[str, str]]] = None

class AttackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    payload_id: str
    payload_hash: str
    category: str
    severity: str
    status: str
    result_class: str # GATEWAY_BLOCKED, DEFENSE_FILTERED, MODEL_REFUSED, POTENTIAL_VIOLATION, ALLOWED
    policy_version: int
    latency_ms: float
    submitted_by: str
    created_at: datetime.datetime

class AttackPayloadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    prompt_text: str
    system_context: Optional[str]
    multi_turn_context: Optional[List[Any]]
    payload_hash: str
    created_by: str
    created_at: datetime.datetime

class AttackLibraryItem(BaseModel):
    id: str
    name: str
    category: str
    severity: str
    description: str
    sample_prompt: str

# --- Blue Team & Defense Schemas ---
class DefenseCreate(BaseModel):
    name: str
    rule_type: str = "keyword_filter" # keyword_filter, regex_guard, semantic_boundary, instruction_fence, canary_trap
    pattern: str
    action: str = "BLOCK" # BLOCK, REDACT, QUARANTINE, LOG
    is_active: bool = True

class DefenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    name: str
    rule_type: str
    pattern: str
    action: str
    version: int
    is_active: bool
    created_by: str
    created_at: datetime.datetime

class DefenseTestReq(BaseModel):
    defense_id: str
    test_input: str

class DefenseTestResult(BaseModel):
    defense_id: str
    matched: bool
    action_taken: str
    sanitized_output: Optional[str]
    latency_ms: float

class RegressionTestReq(BaseModel):
    evaluation_id: str
    policy_version_a: int
    policy_version_b: int

class RegressionTestOut(BaseModel):
    evaluation_id: str
    policy_version_a: int
    policy_version_b: int
    total_vectors_evaluated: int
    mitigated_v1: int
    mitigated_v2: int
    improvement_pct: float
    comparison_details: List[Dict[str, Any]]

class DisclosureRequestCreate(BaseModel):
    attack_id: str
    justification: str

class DisclosureRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    attack_id: str
    requested_by: str
    justification: str
    status: str
    reviewed_by: Optional[str]
    reviewed_at: Optional[datetime.datetime]
    created_at: datetime.datetime

class DisclosureReviewReq(BaseModel):
    status: str # APPROVED, REJECTED

class SecurityFindingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    title: str
    category: str
    severity: str
    description: str
    sanitized_metadata: Dict[str, Any]
    status: str
    created_at: datetime.datetime

class BlueViewOut(BaseModel):
    evaluation_id: str
    status: str
    current_policy_version: int
    total_attacks: int
    threats_detected: int
    defenses_active: int
    findings: List[SecurityFindingOut]
    sanitized_attacks: List[AttackOut]
    active_defenses: List[DefenseOut]
    pending_disclosures: List[DisclosureRequestOut]

# --- Target LLM Laboratory Schemas ---
class InferenceReq(BaseModel):
    prompt: str
    session_id: Optional[str] = None
    system_prompt: Optional[str] = None
    apply_defenses: bool = True

class InferenceOut(BaseModel):
    response: str
    result_class: str # GATEWAY_BLOCKED, DEFENSE_FILTERED, MODEL_REFUSED, POTENTIAL_VIOLATION, ALLOWED
    blocked_by: Optional[str] = None
    latency_ms: float
    provider_name: str
    tokens_in: int
    tokens_out: int
    session_id: str

class SessionResetReq(BaseModel):
    session_id: Optional[str] = None

class SessionResetOut(BaseModel):
    evaluation_id: str
    session_id: str
    status: str
    message: str
    timestamp: datetime.datetime

class ModelDiagnosticsOut(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    service: str
    status: str
    provider: str
    configured_model: str
    available_models: List[str]
    active_sessions: int
    average_latency_ms: float
    total_tokens_processed: int

# --- Evidence & Hash Chain Schemas ---
class EvidenceEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    event_seq: int
    actor: str
    event_type: str
    metadata_json: Dict[str, Any]
    previous_event_hash: str
    event_hash: str
    timestamp: datetime.datetime

class EvidenceVerifyReq(BaseModel):
    evaluation_id: str

class EvidenceVerifyOut(BaseModel):
    evaluation_id: str
    is_valid: bool
    total_events: int
    genesis_hash: str
    tip_hash: str
    tampered_event_seq: Optional[int] = None
    verification_message: str
    verified_at: datetime.datetime

# --- Contamination Testing Schemas ---
class ContaminationCheckReq(BaseModel):
    session_id: Optional[str] = None
    probe_query: Optional[str] = None

class ContaminationCheckOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    session_id: str
    canary_token: str
    is_clean: bool
    isolation_status: str
    probe_query: str
    target_response: str
    details: Dict[str, Any]
    created_at: datetime.datetime

# --- Resource Governor Schemas ---
class ResourceMetricOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    evaluation_id: str
    actor: str
    cpu_usage_pct: float
    memory_mb: float
    request_count: int
    latency_ms: float
    duration_ms: float
    fairness_score: float
    timestamp: datetime.datetime

class ResourceFairnessOut(BaseModel):
    evaluation_id: str
    fairness_score: float # 0 - 100
    red_resource_share_pct: float
    blue_resource_share_pct: float
    llm_resource_share_pct: float
    status: str
    recommendations: List[str]
    metrics: List[ResourceMetricOut]

# --- Trust Score & Passport Schemas ---
class TrustScoreBreakdown(BaseModel):
    isolation_score: float
    evidence_score: float
    contamination_score: float
    fairness_score: float
    access_score: float
    observability_score: float
    overall_score: float
    trust_tier: str

class TestIntegrityPassportOut(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    evaluation_id: str
    project_name: str
    model_identity: str
    model_version: str
    isolation_status: str
    network_policy_status: str
    contamination_status: str
    resource_fairness_status: str
    attack_count: int
    threats_mitigated: int
    defense_events: int
    evidence_chain_status: str
    evidence_tip_hash: str
    trust_score: float
    trust_tier: str
    score_breakdown: TrustScoreBreakdown
    residual_risks: List[str]
    cryptographic_passport_hash: str
    issued_at: datetime.datetime
    verified_by: str = "Bayora Zero-Trust Policy Engine v1.0"
