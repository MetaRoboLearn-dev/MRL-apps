from typing import Optional

from sqlalchemy.orm import Session

from models.user_started_task import UserStartedTask
from utils import utc_now


class UserStartedTaskRepository:
    def __init__(self, session: Session):
        self.session = session

    # ---------- READ ONE ----------
    def get_by_id(self, user_started_task_id: int) -> Optional[UserStartedTask]:
        return (
            self.session.query(UserStartedTask)
            .filter(UserStartedTask.id == user_started_task_id)
            .first()
        )

    # ---------- LIST ----------
    def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        started_by: Optional[int] = None,
        activity_id: Optional[int] = None,
        task_id: Optional[int] = None,
        order_by_started_at: bool = True,
    ) -> list[UserStartedTask]:
        q = self.session.query(UserStartedTask)

        if started_by is not None:
            q = q.filter(UserStartedTask.started_by == started_by)
        if activity_id is not None:
            q = q.filter(UserStartedTask.activity_id == activity_id)
        if task_id is not None:
            q = q.filter(UserStartedTask.task_id == task_id)

        if order_by_started_at:
            q = q.order_by(UserStartedTask.started_at.asc().nullslast(), UserStartedTask.id.asc())

        return q.offset(skip).limit(limit).all()

    # ---------- CREATE ----------
    def create(
        self,
        *,
        started_by: int,
        activity_id: int,
        task_id: int,
        current_value: Optional[str] = None,
        actor_user_id: Optional[int] = None,
    ) -> UserStartedTask:
        now = utc_now()
        ust = UserStartedTask(
            started_by=started_by,
            activity_id=activity_id,
            task_id=task_id,
            current_value=current_value,
            started_at=now,
            created_at=now,
            updated_at=now,
            created_by=actor_user_id,
            updated_by=actor_user_id,
        )

        self.session.add(ust)
        self.session.commit()
        self.session.refresh(ust)
        return ust

    # ---------- UPDATE (PATCH) ----------
    def update(
        self,
        user_started_task_id: int,
        *,
        current_value: Optional[str] = None,
        activity_id: Optional[int] = None,
        task_id: Optional[int] = None,
        actor_user_id: Optional[int] = None,
    ) -> Optional[UserStartedTask]:
        ust = self.get_by_id(user_started_task_id)
        if not ust:
            return None

        if current_value is not None:
            ust.current_value = current_value
        if activity_id is not None:
            ust.activity_id = activity_id
        if task_id is not None:
            ust.task_id = task_id

        ust.updated_at = utc_now()
        ust.updated_by = actor_user_id

        self.session.commit()
        self.session.refresh(ust)
        return ust

    # ---------- DELETE ----------
    def delete(self, user_started_task_id: int) -> bool:
        ust = self.get_by_id(user_started_task_id)
        if not ust:
            return False

        self.session.delete(ust)
        self.session.commit()
        return True