from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.database.session import engine
from app.database.base import Base
import app.models  # Ensure all models are registered
from app.api.v1.router import api_v1_router
from app.middleware.error_handler import global_exception_handler, validation_exception_handler

# Create FastAPI app instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="MeetFlow AI - Production Meeting Management SaaS Backend API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Create DB tables automatically on startup for instant zero-config startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Include routers at root (as specified in prompt API Endpoints) and /api/v1 prefix for flexibility
app.include_router(api_v1_router)
app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to MeetFlow AI Backend API",
        "docs": "/docs",
        "health": "/health"
    }
