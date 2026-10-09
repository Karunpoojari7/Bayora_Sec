import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bayora Zero-Trust AI Evaluation Platform"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://bayora:bayora_dev_only@postgres:5432/bayora")
    SQLITE_FALLBACK_URL: str = "sqlite:///./bayora_dev.db"
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "bayora-zero-trust-secret-key-eval-2026-prod-grade")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    RED_SHARED_TOKEN: str = os.getenv("RED_SHARED_TOKEN", "red-demo-token")
    BLUE_SHARED_TOKEN: str = os.getenv("BLUE_SHARED_TOKEN", "blue-demo-token")
    ADMIN_SHARED_TOKEN: str = os.getenv("ADMIN_SHARED_TOKEN", "admin-demo-token")
    
    LLM_URL: str = os.getenv("LLM_URL", "http://llm:8000")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    
    RATE_LIMIT_PER_MINUTE: int = 120
    MAX_EVAL_CONCURRENCY: int = 10
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
