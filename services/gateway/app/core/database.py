from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging
from app.core.config import settings

logger = logging.getLogger("bayora.database")

def get_engine():
    try:
        # Check if database URL is postgres or sqlite
        db_url = settings.DATABASE_URL
        if "postgresql" in db_url:
            eng = create_engine(db_url, pool_pre_ping=True, pool_size=10, max_overflow=20)
            # Test connection
            with eng.connect() as conn:
                pass
            return eng
        else:
            return create_engine(db_url, connect_args={"check_same_thread": False})
    except Exception as e:
        logger.warning(f"Failed connecting to {settings.DATABASE_URL}: {e}. Falling back to SQLite dev database.")
        return create_engine(settings.SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
