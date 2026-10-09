import hashlib
import json
import bcrypt
from typing import Any

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:72],
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(
        password.encode("utf-8")[:72],
        salt
    ).decode("utf-8")

def sha256_text(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()

def canonical_json_hash(data: Any) -> str:
    """Generate deterministic SHA-256 hash from Python dictionary / structure."""
    if isinstance(data, str):
        return sha256_text(data)
    canonical = json.dumps(data, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def compute_evidence_hash(
    event_id: str,
    evaluation_id: str,
    actor: str,
    event_type: str,
    timestamp_str: str,
    metadata_json: Any,
    previous_event_hash: str
) -> str:
    """Deterministic cryptographic hash computation for the Bayora Hash Chain."""
    meta_hash = canonical_json_hash(metadata_json)
    raw_str = f"{event_id}|{evaluation_id}|{actor}|{event_type}|{timestamp_str}|{meta_hash}|{previous_event_hash}"
    return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()
