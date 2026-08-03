from typing import List
from pydantic import BaseModel
from app.schemas.meeting import MeetingResponse
from app.schemas.task import TaskResponse

class TaskStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int

class DashboardResponse(BaseModel):
    total_meetings: int
    total_notes: int
    ai_summaries_generated: int
    task_stats: TaskStats
    upcoming_meetings: List[MeetingResponse]
    recent_tasks: List[TaskResponse]
