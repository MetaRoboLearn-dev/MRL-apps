from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base
from utils import utc_now

class Role(Base):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    users = relationship('User', back_populates='role')
    

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    last_login = Column(DateTime)
    created_at = Column(DateTime, nullable=False, default=utc_now)
    updated_at = Column(DateTime, default=utc_now)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)

    active = Column(Boolean, nullable=False, default=True)

    role = relationship('Role', back_populates='users')

    creator = relationship("User", foreign_keys='User.created_by', remote_side='User.id', back_populates="created_users")
    updater = relationship("User", foreign_keys='User.updated_by', remote_side='User.id', back_populates="updated_users")

    created_users = relationship("User", foreign_keys="User.created_by", back_populates="creator")
    updated_users = relationship("User", foreign_keys="User.updated_by", back_populates="updater")

    started_tasks = relationship('UserStartedTask',back_populates='user')

    created_activities = relationship('Activity', back_populates='creator', foreign_keys='Activity.created_by')
    updated_activities = relationship('Activity', back_populates='updater', foreign_keys='Activity.updated_by')

    created_tasks = relationship('Task', back_populates='creator', foreign_keys='Task.created_by')
    updated_tasks = relationship('Task', back_populates='updater', foreign_keys='Task.updated_by')