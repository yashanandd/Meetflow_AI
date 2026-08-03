from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NoteCreateRequest(BaseModel):
    meeting_id: int
    raw_note: str

class NoteUpdateRequest(BaseModel):
    raw_note: Optional[str] = None
    ai_summary: Optional[str] = None

class SummarizeNoteRequest(BaseModel):
    meeting_id: Optional[int] = None
    raw_note: Optional[str] = None

class SummarizeNoteResponse(BaseModel):
    ai_summary: str
    provider: str

class NoteResponse(BaseModel):
    id: int
    meeting_id: int
    raw_note: str
    ai_summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
