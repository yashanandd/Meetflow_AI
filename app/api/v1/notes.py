from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm Session
from app.database.session import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.note import NoteCreateRequest, NoteUpdateRequest, NoteResponse, SummarizeNoteRequest, SummarizeNoteResponse
from app.services.note_service import NoteService

router = APIRouter(prefix="/notes", tags=["Meeting Notes"])

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(request: NoteCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return NoteService.create_note(db, current_user.id, request)

@router.post("/summarize", response_model=SummarizeNoteResponse)
def summarize_note(request: SummarizeNoteRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return NoteService.summarize_note(db, current_user.id, request)

@router.get("/{meeting_id}", response_model=List[NoteResponse])
def get_notes_by_meeting(meeting_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return NoteService.get_notes_for_meeting(db, meeting_id, current_user.id)

@router.put("/{id}", response_model=NoteResponse)
def update_note(id: int, request: NoteUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return NoteService.update_note(db, id, current_user.id, request)

@router.delete("/{id}")
def delete_note(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return NoteService.delete_note(db, id, current_user.id)
