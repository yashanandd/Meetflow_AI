from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.meetings import router as meetings_router
from app.api.v1.notes import router as notes_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.dashboard import router as dashboard_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(meetings_router)
api_v1_router.include_router(notes_router)
api_v1_router.include_router(tasks_router)
api_v1_router.include_router(dashboard_router)
