from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)

    size_x = Column(Integer, nullable=False)
    size_z = Column(Integer, nullable=False)
    start = Column(Integer)
    rotation = Column(Float, default=0)
    finish = Column(Integer)

    barriers = Column(JSON)
    stickers = Column(JSON)

    code = Column(Text)
    blocks = Column(Text)

    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime)

    created_by = Column(Integer, ForeignKey('users.id'))
    updated_by = Column(Integer, ForeignKey('users.id'))

    active = Column(Boolean, nullable=False, default=True)

    activity_tasks = relationship('ActivityTask', back_populates='task')
    started_tasks = relationship('UserStartedTask', back_populates='task')
    creator = relationship('User', back_populates='created_tasks', foreign_keys="Task.created_by")
    updater = relationship('User', back_populates='updated_tasks', foreign_keys="Task.updated_by")