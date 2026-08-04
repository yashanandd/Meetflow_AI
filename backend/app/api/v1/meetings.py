from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.meeting import MeetingCreateRequest, MeetingUpdateRequest, MeetingResponse
from app.services.meeting_service import MeetingService

router = APIRouter(prefix="/meetings", tags=["Meetings"])

@router.get("", response_model=List[MeetingResponse])
def get_meetings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeetingService.get_user_meetings(db, current_user.id)

@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(request: MeetingCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeetingService.create_meeting(db, current_user.id, request)

@router.get("/{id}", response_model=MeetingResponse)
def get_meeting(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeetingService.get_meeting_by_id(db, id, current_user.id)

@router.put("/{id}", response_model=MeetingResponse)
def update_meeting(id: int, request: MeetingUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeetingService.update_meeting(db, id, current_user.id, request)

@router.delete("/{id}")
def delete_meeting(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MeetingService.delete_meeting(db, id, current_user.id)
