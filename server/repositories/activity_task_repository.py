from typing import Optional
from sqlalchemy.orm import Session
from models.activity_task import ActivityTask
from utils import utc_now


class ActivityTaskRepository:
    def __init__(self, session: Session):
        self.session = session

    # ---------- READ ONE ----------
    def get_by_id(self, activity_task_id: int) -> Optional[ActivityTask]:
        return (
            self.session.query(ActivityTask)
            .filter(ActivityTask.id == activity_task_id)
            .first()
        )

    # ---------- LIST ----------
    def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        activity_id: Optional[int] = None,
        task_id: Optional[int] = None,
        type_id: Optional[int] = None,
        order_by_order: bool = True,
    ) -> list[ActivityTask]:
        q = self.session.query(ActivityTask)

        if activity_id is not None:
            q = q.filter(ActivityTask.activity_id == activity_id)
        if task_id is not None:
            q = q.filter(ActivityTask.task_id == task_id)
        if type_id is not None:
            q = q.filter(ActivityTask.type_id == type_id)

        if order_by_order:
            q = q.order_by(
                ActivityTask.order.asc().nullslast(),
                ActivityTask.id.asc(),
            )

        return q.offset(skip).limit(limit).all()

    # ---------- CREATE ----------
    def create(
        self,
        *,
        activity_id: int,
        task_id: int,
        type_id: int,
        order: int,
        description: Optional[str] = None,
        actor_user_id: Optional[int] = None,
    ) -> ActivityTask:
        now = utc_now()
        activity_task = ActivityTask(
            activity_id=activity_id,
            task_id=task_id,
            type_id=type_id,
            order=order,
            description=description,
            created_at=now,
            updated_at=now,
            created_by=actor_user_id,
            updated_by=actor_user_id,
        )

        self.session.add(activity_task)
        self.session.commit()
        self.session.refresh(activity_task)
        return activity_task

    # ---------- UPDATE (PATCH) ----------
    def update(
        self,
        activity_task_id: int,
        *,
        description: Optional[str] = None,
        activity_id: Optional[int] = None,
        task_id: Optional[int] = None,
        type_id: Optional[int] = None,
        order: Optional[int] = None,
        actor_user_id: Optional[int] = None,
    ) -> Optional[ActivityTask]:
        activity_task = self.get_by_id(activity_task_id)
        if not activity_task:
            return None

        if description is not None:
            activity_task.description = description
        if activity_id is not None:
            activity_task.activity_id = activity_id
        if task_id is not None:
            activity_task.task_id = task_id
        if type_id is not None:
            activity_task.type_id = type_id
        if order is not None:
            activity_task.order = order

        activity_task.updated_at = utc_now()
        activity_task.updated_by = actor_user_id

        self.session.commit()
        self.session.refresh(activity_task)
        return activity_task

    # ---------- DELETE ----------
    def delete(self, activity_task_id: int) -> bool:
        activity_task = self.get_by_id(activity_task_id)
        if not activity_task:
            return False

        self.session.delete(activity_task)
        self.session.commit()
        return True