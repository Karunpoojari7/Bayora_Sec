import uuid
import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import User
from app.security.crypto import verify_password, get_password_hash
from app.security.rbac import create_access_token, ROLE_PERMISSIONS

class AuthService:
    @staticmethod
    def seed_default_users(db: Session):
        """Seed default demo accounts if table is empty."""
        if db.query(User).count() == 0:
            demo_users = [
                ("admin", "admin@bayora.corp", "admin123", "ADMIN"),
                ("red_operator", "red@bayora.corp", "red123", "RED_TEAM"),
                ("blue_operator", "blue@bayora.corp", "blue123", "BLUE_TEAM"),
                ("auditor", "auditor@bayora.corp", "auditor123", "VIEWER")
            ]
            for username, email, pwd, role in demo_users:
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
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
            "username": user.username,
            "capabilities": caps
        }
