from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class TaskCreateRequest(BaseModel):
    meeting_id: int
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: str = Field("medium", pattern="^(low|medium|high)$")
    status: str = Field("pending", pattern="^(pending|in_progress|completed)$")
    due_date: Optional[datetime] = None

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    status: Optional[str] = Field(None, pattern="^(pending|in_progress|completed)$")
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime
    meeting_title: Optional[str] = None

    class Config:
        from_attributes = True
