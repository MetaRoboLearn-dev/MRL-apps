from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import Base

class UserStartedTask(Base):
    __tablename__ = 'user_started_tasks'
    __table_args__ = (
        UniqueConstraint('user_started_id', 'activity_id', 'task_id'),
    )

    id = Column(Integer, primary_key=True)

    started_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime)

    current_value = Column(String)

    user_started_id = Column(Integer, ForeignKey('users.id'))
    activity_id = Column(Integer, ForeignKey('activities.id'))
    task_id = Column(Integer, ForeignKey('tasks.id'))

    user = relationship('User', back_populates='started_tasks')
    activity = relationship('Activity', back_populates='started_tasks')
    task = relationship('Task', back_populates='started_tasks')

    logs = relationship(
        'UserStartedTaskLog',
        back_populates='user_started_task',
        cascade='all, delete-orphan',
        order_by='UserStartedTaskLog.created_at'
    )