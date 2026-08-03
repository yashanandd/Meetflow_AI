from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.meeting_repo import MeetingRepository
from app.schemas.meeting import MeetingCreateRequest, MeetingUpdateRequest, MeetingResponse

class MeetingService:
    @staticmethod
    def create_meeting(db: Session, user_id: int, request: MeetingCreateRequest) -> MeetingResponse:
        meeting = MeetingRepository.create(
            db=db,
            title=request.title,
            description=request.description,
            meeting_date=request.meeting_date,
            user_id=user_id
        )
        res = MeetingResponse.model_validate(meeting)
        res.notes_count = len(meeting.notes) if meeting.notes else 0
        res.tasks_count = len(meeting.tasks) if meeting.tasks else 0
        return res

    @staticmethod
    def get_user_meetings(db: Session, user_id: int) -> List[MeetingResponse]:
        meetings = MeetingRepository.get_all_by_user(db, user_id)
        results = []
        for m in meetings:
            res = MeetingResponse.model_validate(m)
            res.notes_count = len(m.notes) if m.notes else 0
            res.tasks_count = len(m.tasks) if m.tasks else 0
            results.append(res)
        return results

    @staticmethod
    def get_meeting_by_id(db: Session, meeting_id: int, user_id: int) -> MeetingResponse:
        meeting = MeetingRepository.get_by_id(db, meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        res = MeetingResponse.model_validate(meeting)
        res.notes_count = len(meeting.notes) if meeting.notes else 0
        res.tasks_count = len(meeting.tasks) if meeting.tasks else 0
        return res

    @staticmethod
    def update_meeting(db: Session, meeting_id: int, user_id: int, request: MeetingUpdateRequest) -> MeetingResponse:
        meeting = MeetingRepository.get_by_id(db, meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        updated = MeetingRepository.update(
            db=db,
            meeting=meeting,
            title=request.title,
            description=request.description,
            meeting_date=request.meeting_date
        )
        res = MeetingResponse.model_validate(updated)
        res.notes_count = len(updated.notes) if updated.notes else 0
        res.tasks_count = len(updated.tasks) if updated.tasks else 0
        return res

    @staticmethod
    def delete_meeting(db: Session, meeting_id: int, user_id: int) -> dict:
        meeting = MeetingRepository.get_by_id(db, meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        MeetingRepository.delete(db, meeting)
        return {"message": "Meeting deleted successfully"}
