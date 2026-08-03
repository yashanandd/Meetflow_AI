from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.task_repo import TaskRepository
from app.repositories.meeting_repo import MeetingRepository
from app.schemas.task import TaskCreateRequest, TaskUpdateRequest, TaskResponse

class TaskService:
    @staticmethod
    def create_task(db: Session, user_id: int, request: TaskCreateRequest) -> TaskResponse:
        meeting = MeetingRepository.get_by_id(db, request.meeting_id, user_id)
        if not meeting:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated meeting not found")
        task = TaskRepository.create(
            db=db,
            meeting_id=request.meeting_id,
            title=request.title,
            description=request.description,
            priority=request.priority,
            status=request.status,
            due_date=request.due_date
        )
        res = TaskResponse.model_validate(task)
        res.meeting_title = meeting.title
        return res

    @staticmethod
    def get_user_tasks(db: Session, user_id: int, meeting_id: Optional[int] = None) -> List[TaskResponse]:
        if meeting_id:
            tasks = TaskRepository.get_all_by_meeting(db, meeting_id, user_id)
        else:
            tasks = TaskRepository.get_all_by_user(db, user_id)

        results = []
        for t in tasks:
            res = TaskResponse.model_validate(t)
            if t.meeting:
                res.meeting_title = t.meeting.title
            results.append(res)
        return results

    @staticmethod
    def update_task(db: Session, task_id: int, user_id: int, request: TaskUpdateRequest) -> TaskResponse:
        task = TaskRepository.get_by_id(db, task_id, user_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        updated = TaskRepository.update(
            db=db,
            task=task,
            title=request.title,
            description=request.description,
            priority=request.priority,
            status=request.status,
            due_date=request.due_date
        )
        res = TaskResponse.model_validate(updated)
        if updated.meeting:
            res.meeting_title = updated.meeting.title
        return res

    @staticmethod
    def delete_task(db: Session, task_id: int, user_id: int) -> dict:
        task = TaskRepository.get_by_id(db, task_id, user_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        TaskRepository.delete(db, task)
        return {"message": "Task deleted successfully"}
