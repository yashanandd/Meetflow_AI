from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.note import MeetingNote
from app.models.meeting import Meeting

class NoteRepository:
    @staticmethod
    def get_by_id(db: Session, note_id: int, user_id: int) -> Optional[MeetingNote]:
        return db.query(MeetingNote).join(Meeting).filter(
            MeetingNote.id == note_id,
            Meeting.created_by == user_id
        ).first()

    @staticmethod
    def get_by_meeting_id(db: Session, meeting_id: int, user_id: int) -> List[MeetingNote]:
        return db.query(MeetingNote).join(Meeting).filter(
            MeetingNote.meeting_id == meeting_id,
            Meeting.created_by == user_id
        ).order_by(MeetingNote.created_at.desc()).all()

    @staticmethod
    def create(db: Session, meeting_id: int, raw_note: str, ai_summary: Optional[str] = None) -> MeetingNote:
        note = MeetingNote(
            meeting_id=meeting_id,
            raw_note=raw_note,
            ai_summary=ai_summary
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def update(db: Session, note: MeetingNote, raw_note: Optional[str] = None, ai_summary: Optional[str] = None) -> MeetingNote:
        if raw_note is not None:
            note.raw_note = raw_note
        if ai_summary is not None:
            note.ai_summary = ai_summary
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def delete(db: Session, note: MeetingNote) -> None:
        db.delete(note)
        db.commit()
