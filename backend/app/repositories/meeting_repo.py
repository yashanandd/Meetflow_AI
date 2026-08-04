from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.meeting import Meeting

class MeetingRepository:
    @staticmethod
    def get_by_id(db: Session, meeting_id: int, user_id: int) -> Optional[Meeting]:
        return db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.created_by == user_id).first()

    @staticmethod
    def get_all_by_user(db: Session, user_id: int) -> List[Meeting]:
        return db.query(Meeting).filter(Meeting.created_by == user_id).order_by(Meeting.meeting_date.desc()).all()

    @staticmethod
    def create(db: Session, title: str, description: Optional[str], meeting_date: datetime, user_id: int) -> Meeting:
        meeting = Meeting(
            title=title,
            description=description,
            meeting_date=meeting_date,
            created_by=user_id
        )
        db.add(meeting)
        db.commit()
        db.refresh(meeting)
        return meeting

    @staticmethod
    def update(db: Session, meeting: Meeting, title: Optional[str], description: Optional[str], meeting_date: Optional[datetime]) -> Meeting:
        if title is not None:
            meeting.title = title
        if description is not None:
            meeting.description = description
        if meeting_date is not None:
            meeting.meeting_date = meeting_date
        db.commit()
        db.refresh(meeting)
        return meeting

    @staticmethod
    def delete(db: Session, meeting: Meeting) -> None:
        db.delete(meeting)
        db.commit()
