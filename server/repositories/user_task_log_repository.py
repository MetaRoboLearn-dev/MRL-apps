from typing import Optional

from sqlalchemy.orm import Session

from models.user_task_log import UserTaskLog
from utils import utc_now


class UserTaskLogRepository:
    def __init__(self, session: Session):
        self.session = session

    # ---------- READ ONE ----------
    def get_by_id(self, log_id: int) -> Optional[UserTaskLog]:
        return (
            self.session.query(UserTaskLog)
            .filter(UserTaskLog.id == log_id)
            .first()
        )

    # ---------- LIST ----------
    def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        user_started_task_id: Optional[int] = None,
        event_type_id: Optional[int] = None,
        order_by_created_at: bool = True,
    ) -> list[UserTaskLog]:
        q = self.session.query(UserTaskLog)

        if user_started_task_id is not None:
            q = q.filter(UserTaskLog.user_started_task_id == user_started_task_id)
        if event_type_id is not None:
            q = q.filter(UserTaskLog.event_type_id == event_type_id)

        if order_by_created_at:
            q = q.order_by(UserTaskLog.created_at.asc().nullslast(), UserTaskLog.id.asc())

        return q.offset(skip).limit(limit).all()

    # ---------- CREATE ----------
    def create(
        self,
        *,
        user_started_task_id: int,
        event_type_id: Optional[int] = None,
        code_snapshot: Optional[str] = None,
    ) -> UserTaskLog:

        log = UserTaskLog(
            user_started_task_id=user_started_task_id,
            event_type_id=event_type_id,
            created_at=utc_now(),
            code_snapshot=code_snapshot,
        )

        self.session.add(log)
        self.session.commit()
        self.session.refresh(log)
        return log

    # ---------- DELETE ----------
    def delete(self, log_id: int) -> bool:
        log = self.get_by_id(log_id)
        if not log:
            return False

        self.session.delete(log)
        self.session.commit()
        return True