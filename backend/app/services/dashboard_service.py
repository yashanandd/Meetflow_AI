from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.repositories.meeting_repo import MeetingRepository
from app.repositories.task_repo import TaskRepository
from app.repositories.note_repo import NoteRepository
from app.models.note import MeetingNote
from app.models.meeting import Meeting
from app.schemas.dashboard import DashboardResponse, TaskStats
from app.schemas.meeting import MeetingResponse
from app.schemas.task import TaskResponse

class DashboardService:
    @staticmethod
    def get_user_dashboard(db: Session, user_id: int) -> DashboardResponse:
        all_meetings = MeetingRepository.get_all_by_user(db, user_id)
        all_tasks = TaskRepository.get_all_by_user(db, user_id)
        
        # Calculate task stats
        pending_count = sum(1 for t in all_tasks if t.status == "pending")
        in_progress_count = sum(1 for t in all_tasks if t.status == "in_progress")
        completed_count = sum(1 for t in all_tasks if t.status == "completed")
        
        task_stats = TaskStats(
            total=len(all_tasks),
            pending=pending_count,
            in_progress=in_progress_count,
            completed=completed_count
        )

        # Calculate notes stats
        total_notes = db.query(MeetingNote).join(Meeting).filter(Meeting.created_by == user_id).count()
        ai_summaries_count = db.query(MeetingNote).join(Meeting).filter(
            Meeting.created_by == user_id,
            MeetingNote.ai_summary.isnot(None),
            MeetingNote.ai_summary != ""
        ).count()

        # Upcoming meetings (meeting_date >= now or most recent 5)
        now_naive = datetime.now()
        upcoming = []
        for m in all_meetings:
            if m.meeting_date:
                m_date = m.meeting_date.replace(tzinfo=None) if m.meeting_date.tzinfo else m.meeting_date
                if m_date >= now_naive:
                    upcoming.append(m)

        if not upcoming:
            upcoming = all_meetings[:5]
        else:
            upcoming = upcoming[:5]

        upcoming_responses = []
        for m in upcoming:
            res = MeetingResponse.model_validate(m)
            res.notes_count = len(m.notes) if m.notes else 0
            res.tasks_count = len(m.tasks) if m.tasks else 0
            upcoming_responses.append(res)

        # Recent tasks (most recent 5)
        recent_tasks_responses = []
        for t in all_tasks[:5]:
            res = TaskResponse.model_validate(t)
            if t.meeting:
                res.meeting_title = t.meeting.title
            recent_tasks_responses.append(res)

        return DashboardResponse(
            total_meetings=len(all_meetings),
            total_notes=total_notes,
            ai_summaries_generated=ai_summaries_count,
            task_stats=task_stats,
            upcoming_meetings=upcoming_responses,
            recent_tasks=recent_tasks_responses
        )
