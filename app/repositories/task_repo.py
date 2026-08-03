from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.meeting import Meeting

class TaskRepository:
    @staticmethod
    def get_by_id(db: Session, task_id: int, user_id: int) -> Optional[Task]:
        return db.query(Task).join(Meeting).filter(
            Task.id == task_id,
            Meeting.created_by == user_id
        ).first()

    @staticmethod
    def get_all_by_user(db: Session, user_id: int) -> List[Task]:
        return db.query(Task).join(Meeting).filter(
            Meeting.created_by == user_id
        ).order_by(Task.created_at.desc()).all()

    @staticmethod
    def get_all_by_meeting(db: Session, meeting_id: int, user_id: int) -> List[Task]:
        return db.query(Task).join(Meeting).filter(
            Task.meeting_id == meeting_id,
            Meeting.created_by == user_id
        ).order_by(Task.created_at.desc()).all()

    @staticmethod
    def create(
        db: Session,
        meeting_id: int,
        title: str,
        description: Optional[str],
        priority: str,
        status: str,
        due_date: Optional[datetime]
    ) -> Task:
        task = Task(
            meeting_id=meeting_id,
            title=title,
            description=description,
            priority=priority,
            status=status,
            due_date=due_date
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def update(
        db: Session,
        task: Task,
        title: Optional[str] = None,
        description: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        due_date: Optional[datetime] = None
    ) -> Task:
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if priority is not None:
            task.priority = priority
        if status is not None:
            task.status = status
        if due_date is not None:
            task.due_date = due_date
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete(db: Session, task: Task) -> None:
        db.delete(task)
        db.commit()
