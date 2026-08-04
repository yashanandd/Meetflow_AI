from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.note_repo import NoteRepository
from app.repositories.meeting_repo import MeetingRepository
from app.schemas.note import NoteCreateRequest, NoteUpdateRequest, NoteResponse, SummarizeNoteRequest, SummarizeNoteResponse
from app.ai.service import AISummaryService

class NoteService:
    @staticmethod
    def create_note(db: Session, user_id: int, request: NoteCreateRequest) -> NoteResponse:
        meeting = MeetingRepository.get_by_id(db, request.meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated meeting not found")
        note = NoteRepository.create(db=db, meeting_id=request.meeting_id, raw_note=request.raw_note)
        return NoteResponse.model_validate(note)

    @staticmethod
    def get_notes_for_meeting(db: Session, meeting_id: int, user_id: int) -> List[NoteResponse]:
        meeting = MeetingRepository.get_by_id(db, meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        notes = NoteRepository.get_by_meeting_id(db, meeting_id, user_id)
        return [NoteResponse.model_validate(n) for n in notes]

    @staticmethod
    def update_note(db: Session, note_id: int, user_id: int, request: NoteUpdateRequest) -> NoteResponse:
        note = NoteRepository.get_by_id(db, note_id, user_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        updated = NoteRepository.update(db, note, raw_note=request.raw_note, ai_summary=request.ai_summary)
        return NoteResponse.model_validate(updated)

    @staticmethod
    def delete_note(db: Session, note_id: int, user_id: int) -> dict:
        note = NoteRepository.get_by_id(db, note_id, user_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        NoteRepository.delete(db, note)
        return {"message": "Note deleted successfully"}

    @staticmethod
    def summarize_note(db: Session, user_id: int, request: SummarizeNoteRequest) -> SummarizeNoteResponse:
        raw_text = ""
        if request.raw_note:
            raw_text = request.raw_note
        elif request.meeting_id:
            notes = NoteRepository.get_by_meeting_id(db, request.meeting_id, user_id)
            if not notes:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No notes found for this meeting")
            raw_text = "\n\n".join([n.raw_note for n in notes if n.raw_note])
        
        if not raw_text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No note content provided to summarize")

        summary, provider = AISummaryService.generate_summary(raw_text)

        # If meeting_id is passed, automatically attach summary to latest note
        if request.meeting_id:
            notes = NoteRepository.get_by_meeting_id(db, request.meeting_id, user_id)
            if notes:
                NoteRepository.update(db, notes[0], ai_summary=summary)

        return SummarizeNoteResponse(ai_summary=summary, provider=provider)
