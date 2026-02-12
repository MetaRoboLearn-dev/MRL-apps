from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from contextlib import contextmanager
from seed import seed_roles
from models.base import Base

engine = None
SessionLocal = None

def init_db(app=None):
    """Initialize database with Flask app or standalone"""
    global engine, SessionLocal
    
    if app:
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    else:
        user = 'postgres'
        password = '123'
        host = 'localhost'
        port = 5432
        database = 'mrl'
        db_uri = "postgresql+psycopg2://{0}:{1}@{2}:{3}/{4}".format(
            user, password, host, port, database
        )
    
    engine = create_engine(db_uri, echo=True)
    SessionLocal = scoped_session(sessionmaker(bind=engine))
    
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        seed_roles(session)

def get_db():
    """Get database session (use with context manager)"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def db_session():
    """Context manager for database sessions"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()