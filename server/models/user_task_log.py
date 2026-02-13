from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class EventType(Base):
    __tablename__ = 'event_types'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

class UserTaskLog(Base):
    __tablename__ = 'user_task_logs'

    id = Column(Integer, primary_key=True)

    user_started_task_id = Column(
        Integer,
        ForeignKey('user_started_tasks.id'),
        nullable=False
    )

    event_type_id = Column(Integer, ForeignKey("event_types.id"))

    created_at = Column(DateTime, nullable=False)
    code_snapshot = Column(Text) # cijeli kod u tom trenutku

    user_started_task = relationship('UserStartedTask', back_populates='logs')
    event_type = relationship('EventType')