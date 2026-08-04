from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.task import TaskCreateRequest, TaskUpdateRequest, TaskResponse
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskResponse])
def get_tasks(
    meeting_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TaskService.get_user_tasks(db, current_user.id, meeting_id)

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(request: TaskCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return TaskService.create_task(db, current_user.id, request)

@router.put("/{id}", response_model=TaskResponse)
def update_task(id: int, request: TaskUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return TaskService.update_task(db, id, current_user.id, request)

@router.delete("/{id}")
def delete_task(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return TaskService.delete_task(db, id, current_user.id)
