import datetime
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import ActivityTask
from models.activity import Activity
from repositories.base_repository import BaseRepository
from utils import utc_now

class ActivityRepository(BaseRepository[Activity]):
    def __init__(self, session: Session):
        super().__init__(session, Activity)

    # ---------- LIST ----------
    def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        active_only: Optional[bool] = None,
        search: Optional[str] = None,
        order_by_time_from: bool = True,
    ) -> list[Activity]:
        q = self.session.query(Activity)

        if active_only:
            q = q.filter(Activity.active.is_(True))

        if search:
            like = f"%{search}%"
            q = q.filter(
                or_(
                    Activity.title.ilike(like),
                    Activity.description.ilike(like),
                )
            )

        if order_by_time_from:
            q = q.order_by(Activity.time_from.asc().nullslast(), Activity.id.asc())

        return q.offset(skip).limit(limit).all()

    # ---------- READ ALL ACTIVITY TASKS ----------
    def get_activity_tasks(self, entity_id: int) -> Optional[ActivityTask]:
        return self.session.query(Activity.activity_tasks).filter(Activity.id == entity_id).first()

    # ---------- CREATE ----------
    def create(
        self,
        *,
        title: str,
        description: Optional[str] = None,
        time_from: datetime,
        time_to: datetime,
        actor_user_id: Optional[int] = None,
    ) -> Activity:
        now = utc_now()
        activity = Activity(
            title=title,
            description=description,
            time_from=time_from,
            time_to=time_to,
            created_at=now,
            updated_at=now,
            created_by=actor_user_id,
            updated_by=actor_user_id,
            active=True,
        )

        self.session.add(activity)
        self.session.commit()
        self.session.refresh(activity)
        return activity

    # ---------- UPDATE (PATCH) ----------
    def update(
        self,
        activity_id: int,
        *,
        title: Optional[str] = None,
        description: Optional[str] = None,
        time_from: Optional[datetime] = None,
        time_to: Optional[datetime] =None,
        active: Optional[bool] = None,
        actor_user_id: Optional[int] = None,
    ) -> Optional[Activity]:
        activity = self.get_by_id(activity_id)
        if not activity:
            return None

        if title is not None:
            activity.title = title
        if description is not None:
            activity.description = description

        if time_from is not None:
            activity.time_from = time_from
        if time_to is not None:
            activity.time_to = time_to

        if active is not None:
            activity.active = active

        activity.updated_at = utc_now()
        activity.updated_by = actor_user_id

        self.session.commit()
        self.session.refresh(activity)
        return activity