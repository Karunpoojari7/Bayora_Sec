import uuid
import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import User, RefreshToken
from app.security.crypto import verify_password, get_password_hash, sha256_text
from app.security.rbac import create_access_token, create_refresh_token, ROLE_PERMISSIONS
from jose import jwt, JWTError
from app.core.config import settings

class AuthService:
    @staticmethod
    def seed_default_users(db: Session):
        """Seed default demo accounts if table is empty or missing roles."""
        demo_users = [
            ("admin", "admin@bayora.corp", "admin123", "ADMIN"),
            ("red_operator", "red@bayora.corp", "red123", "RED_TEAM"),
            ("blue_operator", "blue@bayora.corp", "blue123", "BLUE_TEAM"),
            ("model_operator", "model@bayora.corp", "model123", "MODEL_OPERATOR"),
            ("auditor", "auditor@bayora.corp", "auditor123", "VIEWER")
        ]
        for username, email, pwd, role in demo_users:
            existing = db.query(User).filter(User.username == username).first()
            if not existing:
                u = User(
                    id=f"USR-{uuid.uuid4().hex[:8].upper()}",
                    username=username,
                    email=email,
                    hashed_password=get_password_hash(pwd),
                    role=role,
                    is_active=True,
                    created_at=datetime.datetime.utcnow()
                )
                db.add(u)
        db.commit()

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[Dict[str, Any]]:
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        
        caps = ROLE_PERMISSIONS.get(user.role, ROLE_PERMISSIONS["VIEWER"])
        token_data = {
            "sub": user.id,
            "username": user.username,
            "role": user.role
        }
        access_token = create_access_token(token_data)
        raw_refresh, token_hash, expires_at = create_refresh_token(user.id)

        # Store refresh token record
        rt = RefreshToken(
            id=f"RT-{uuid.uuid4().hex[:8].upper()}",
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            is_revoked=False,
            created_at=datetime.datetime.utcnow()
        )
        db.add(rt)
        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": raw_refresh,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
            "username": user.username,
            "capabilities": caps
        }

    @staticmethod
    def refresh_access_token(db: Session, raw_refresh_token: str) -> Optional[Dict[str, Any]]:
        try:
            payload = jwt.decode(raw_refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            if payload.get("type") != "refresh":
                return None
            user_id = payload.get("sub")
        except JWTError:
            return None

        token_hash = sha256_text(raw_refresh_token)
        rt = db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked == False
        ).first()

        if not rt or rt.expires_at < datetime.datetime.utcnow():
            return None

        # Revoke old refresh token (Token Rotation)
        rt.is_revoked = True

        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            db.commit()
            return None

        caps = ROLE_PERMISSIONS.get(user.role, ROLE_PERMISSIONS["VIEWER"])
        token_data = {
            "sub": user.id,
            "username": user.username,
            "role": user.role
        }
        new_access_token = create_access_token(token_data)
        new_raw_refresh, new_token_hash, new_expires_at = create_refresh_token(user.id)

        new_rt = RefreshToken(
            id=f"RT-{uuid.uuid4().hex[:8].upper()}",
            user_id=user.id,
            token_hash=new_token_hash,
            expires_at=new_expires_at,
            is_revoked=False,
            created_at=datetime.datetime.utcnow()
        )
        db.add(new_rt)
        db.commit()

        return {
            "access_token": new_access_token,
            "refresh_token": new_raw_refresh,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
            "username": user.username,
            "capabilities": caps
        }

    @staticmethod
    def revoke_refresh_token(db: Session, raw_refresh_token: str) -> bool:
        try:
            token_hash = sha256_text(raw_refresh_token)
            rt = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
            if rt:
                rt.is_revoked = True
                db.commit()
                return True
        except Exception:
            pass
        return False
