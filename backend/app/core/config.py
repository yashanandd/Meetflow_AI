import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MeetFlow AI"
    SECRET_KEY: str = "meetflow-super-secret-jwt-key-change-in-production-32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Database URL defaults to SQLite for local development resilience, configurable to MySQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./meetflow.db")
    
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "heuristic")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
