import datetime
import uuid
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, Security, status, Header, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings
from app.security.crypto import sha256_text

security_bearer = HTTPBearer(auto_error=False)

# Granular Capability Matrix
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "ADMIN": [
        "admin:all", "admin:manage_users",
        "evaluation:create", "evaluation:control", "evaluation:delete",
        "red:execute", "red:submit_attack", "red:read_payload",
        "blue:read_sanitized_results", "blue:write_defense", "blue:test_defense", "blue:approve_disclosure",
        "model:operate", "model:reset",
        "evidence:read", "evidence:verify", "contamination:check",
        "trust:read", "trust:export"
    ],
    "RED_TEAM": [
        "red:execute", "red:submit_attack", "red:read_payload",
        "evaluation:control",
        "evidence:read", "trust:read"
    ],
    "BLUE_TEAM": [
        "blue:read_sanitized_results", "blue:write_defense", "blue:test_defense", "blue:request_disclosure",
        "evaluation:control",
        "evidence:read", "trust:read"
    ],
    "MODEL_OPERATOR": [
        "model:operate", "model:reset",
        "evaluation:control",
        "evidence:read", "trust:read"
    ],
    "VIEWER": [
        "blue:read_sanitized_results",
        "evidence:read", "trust:read"
    ]
}

class AuthContext:
    def __init__(self, user_id: str, username: str, role: str, capabilities: List[str]):
        self.user_id = user_id
        self.username = username
        self.role = role
        self.capabilities = capabilities

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> tuple[str, str, datetime.datetime]:
    token_id = str(uuid.uuid4())
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    payload = {
        "sub": user_id,
        "jti": token_id,
        "exp": expires_at,
        "type": "refresh"
    }
    raw_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    token_hash = sha256_text(raw_token)
    return raw_token, token_hash, expires_at

def get_current_actor(
    auth_header: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
    x_bayora_capability: Optional[str] = Header(None, alias="X-Bayora-Capability")
) -> AuthContext:
    """
    Resolve authentication via either:
    1. Short-lived JWT Bearer token
    2. Shared capability token (X-Bayora-Capability header) for isolated container sandboxes
    """
    if x_bayora_capability:
        if x_bayora_capability == settings.RED_SHARED_TOKEN:
            return AuthContext("red-sandbox", "red_team_sandbox", "RED_TEAM", ROLE_PERMISSIONS["RED_TEAM"])
        elif x_bayora_capability == settings.BLUE_SHARED_TOKEN:
            return AuthContext("blue-sandbox", "blue_team_sandbox", "BLUE_TEAM", ROLE_PERMISSIONS["BLUE_TEAM"])
        elif x_bayora_capability == settings.ADMIN_SHARED_TOKEN:
            return AuthContext("admin-sandbox", "admin_system", "ADMIN", ROLE_PERMISSIONS["ADMIN"])
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": {"code": "INVALID_CAPABILITY", "message": "The provided X-Bayora-Capability token is invalid"}}
            )

    if auth_header and auth_header.credentials:
        token = auth_header.credentials
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id: str = payload.get("sub")
            username: str = payload.get("username", user_id)
            role: str = payload.get("role", "VIEWER")
            if user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
            caps = ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["VIEWER"])
            return AuthContext(user_id, username, role, caps)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": {"code": "INVALID_TOKEN", "message": "Bearer token is invalid or expired"}}
            )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "UNAUTHORIZED", "message": "Authentication credentials required via Bearer token or X-Bayora-Capability"}}
    )

def require_capability(required_capability: str):
    def dependency(actor: AuthContext = Depends(get_current_actor)):
        if "admin:all" in actor.capabilities or required_capability in actor.capabilities:
            return actor
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {
                    "code": "CAPABILITY_DENIED",
                    "message": f"Actor role '{actor.role}' lacks required capability: '{required_capability}'"
                }
            }
        )
    return dependency

def require_any_capability(capabilities: List[str]):
    def dependency(actor: AuthContext = Depends(get_current_actor)):
        if "admin:all" in actor.capabilities or any(c in actor.capabilities for c in capabilities):
            return actor
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {
                    "code": "CAPABILITY_DENIED",
                    "message": f"Actor role '{actor.role}' lacks required capabilities from: {capabilities}"
                }
            }
        )
    return dependency

def require_role(allowed_roles: List[str]):
    def dependency(actor: AuthContext = Depends(get_current_actor)):
        if actor.role in allowed_roles or actor.role == "ADMIN":
            return actor
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": {
                    "code": "ROLE_DENIED",
                    "message": f"Role '{actor.role}' not permitted. Required: {allowed_roles}"
                }
            }
        )
    return dependency
