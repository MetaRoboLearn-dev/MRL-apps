from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import Task
from repositories.base_repository import BaseRepository
from utils import utc_now


class TaskRepository(BaseRepository[Task]):
    def __init__(self, session: Session):
        super().__init__(session, Task)

    # ---------- READ ONE ----------
    # def get_by_id(self, task_id: int) -> Optional[Task]:
    #     return self.session.query(Task).filter(Task.id == task_id).first()

    # ---------- LIST ----------
    def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        active_only: Optional[bool] = None,
        search: Optional[str] = None,
        order_by_title: bool = True,
    ) -> list[Task]:
        q = self.session.query(Task)

        if active_only:
            q = q.filter(Task.active.is_(True))

        if search:
            like = f"%{search}%"
            q = q.filter(
                or_(
                    Task.title.ilike(like),
                    Task.description.ilike(like),
                )
            )

        if order_by_title:
            q = q.order_by(Task.title.asc())

        return q.offset(skip).limit(limit).all()

    # ---------- CREATE ----------
    from typing import Optional

    def create(
        self,
        *,
        title: str,
        description: Optional[str] = None,
        size_x: int,
        size_z: int,
        start: Optional[int] = None,
        rotation: Optional[float],
        finish: Optional[int] = None,
        barriers: Optional[dict] = None,
        stickers: Optional[dict] = None,
        code: Optional[str] = None,
        blocks: Optional[str] = None,
        actor_user_id: Optional[int] = None,
    ) -> Task:
        now = utc_now()
        task = Task(
            title=title,
            description=description,
            size_x=size_x,
            size_z=size_z,
            start=start,
            rotation=rotation,
            finish=finish,
            barriers=barriers,
            stickers=stickers,
            code=code,
            blocks=blocks,
            created_at=now,
            updated_at=now,
            created_by=actor_user_id,
            updated_by=actor_user_id,
            active=True,
        )

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    # ---------- UPDATE (PATCH) ----------
    def update(
        self,
        task_id: int,
        *,
        title: Optional[str] = None,
        description: Optional[str] = None,
        size_x: Optional[int] = None,
        size_z: Optional[int] = None,
        start: Optional[int] = None,
        rotation: Optional[float] = None,
        finish: Optional[int] = None,
        barriers=None,
        stickers=None,
        code: Optional[str] = None,
        blocks: Optional[str] = None,
        active: Optional[bool] = None,
        actor_user_id: Optional[int] = None,
    ) -> Optional[Task]:
        task = self.get_by_id(task_id)
        if not task:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if size_x is not None:
            task.size_x = size_x
        if size_z is not None:
            task.size_z = size_z
        if start is not None:
            task.start = start
        if rotation is not None:
            task.rotation = rotation
        if finish is not None:
            task.finish = finish

        # JSON-ish fields: allow explicit clearing by passing None
        # If you want "only update when provided", keep as-is and only set when not None.
        if barriers is not None:
            task.barriers = barriers
        if stickers is not None:
            task.stickers = stickers

        if code is not None:
            task.code = code
        if blocks is not None:
            task.blocks = blocks

        if active is not None:
            task.active = active

        task.updated_at = utc_now()
        task.updated_by = actor_user_id

        self.session.commit()
        self.session.refresh(task)
        return task

    # ---------- DELETE ----------
    # def delete(self, task_id: int) -> bool:
    #     task = self.get_by_id(task_id)
    #     if not task:
    #         return False
    #
    #     self.session.delete(task)
    #     self.session.commit()
    #     return True

    # ---------- DEACTIVATE ----------
    # def deactivate(self, task_id: int, actor_user_id: int | None = None) -> Task | None:
    #     task = self.get_by_id(task_id)
    #     if not task:
    #         return None
    #
    #     task.active = False
    #     task.updated_at = utc_now()
    #     task.updated_by = actor_user_id
    #
    #     self.session.commit()
    #     self.session.refresh(task)
    #     return task

    # ---------- ACTIVATE ----------
    # def activate(self, task_id: int, actor_user_id: int | None = None) -> Task | None:
    #     task = self.get_by_id(task_id)
    #     if not task:
    #         return None
    #
    #     task.active = True
    #     task.updated_at = utc_now()
    #     task.updated_by = actor_user_id
    #
    #     self.session.commit()
    #     self.session.refresh(task)
    #     return task