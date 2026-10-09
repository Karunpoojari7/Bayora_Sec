from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import UserLogin, TokenResponse, UserOut, UserCreate, RefreshTokenReq
from app.services.auth_service import AuthService
from app.security.rbac import get_current_actor, AuthContext, create_access_token, require_capability
from app.models.models import User, RefreshToken
from app.security.crypto import sha256_text
import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    auth_data = AuthService.authenticate_user(db, creds.username, creds.password)
    if not auth_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "AUTH_FAILED", "message": "Invalid username or password"}}
        )
    return auth_data

@router.post("/register", response_model=UserOut)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("admin:manage_users"))
):
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    from app.security.crypto import get_password_hash
    import uuid
    user = User(
        id=f"USR-{uuid.uuid4().hex[:8].upper()}",
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role,
        is_active=True,
        created_at=datetime.datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me")
def get_current_user_profile(actor: AuthContext = Depends(get_current_actor)):
    return {
        "user_id": actor.user_id,
        "username": actor.username,
        "role": actor.role,
        "capabilities": actor.capabilities
    }

@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    actor: AuthContext = Depends(require_capability("admin:manage_users"))
):
    return db.query(User).all()
