from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import Base
from utils import utc_now

class Type(Base):
    __tablename__ = 'types'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

    activity_tasks = relationship('ActivityTask')


class ActivityTask(Base):
    __tablename__ = 'activity_tasks'

    id = Column(Integer, primary_key=True)
    description = Column(String)

    activity_id = Column(Integer, ForeignKey('activities.id'))
    task_id = Column(Integer, ForeignKey('tasks.id'))
    type_id = Column(Integer, ForeignKey('types.id'))
    order = Column(Integer)

    created_at = Column(DateTime, nullable=False, default=utc_now)
    updated_at = Column(DateTime, default=utc_now)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    activity = relationship('Activity', back_populates='activity_tasks')
    task = relationship('Task')
    type = relationship('Type')

    creator = relationship('User', foreign_keys="ActivityTask.created_by")
    updater = relationship('User', foreign_keys="ActivityTask.updated_by")

    __table_args__ = (
        UniqueConstraint(
            "activity_id", "task_id", "type_id", "order",
            name="uq_activity_task_type_order",
        ),
    )