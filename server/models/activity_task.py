from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import Base

class Type(Base):
    __tablename__ = 'types'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

    activity_tasks = relationship('ActivityTask', back_populates='type')


class ActivityTask(Base):
    __tablename__ = 'activity_tasks'

    id = Column(Integer, primary_key=True)
    description = Column(String)

    activity_id = Column(Integer, ForeignKey('activities.id'))
    task_id = Column(Integer, ForeignKey('tasks.id'))
    type_id = Column(Integer, ForeignKey('types.id'))
    order = Column(Integer)

    activity = relationship('Activity', back_populates='activity_tasks')
    task = relationship('Task', back_populates='activity_tasks')
    type = relationship('Type', back_populates='activity_tasks')

    __table_args__ = (
        UniqueConstraint(
            "activity_id",
            "task_id",
            "type_id",
            "order",
            name="uq_activity_task_type_order",
        ),
    )