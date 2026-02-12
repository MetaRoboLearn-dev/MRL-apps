from sqlalchemy import select
from models import Role


def seed_roles(session):
    existing = session.execute(select(Role.name)).scalars().all()

    default_roles = ["admin", "teacher", "student"]

    for role_name in default_roles:
        if role_name not in existing:
            session.add(Role(name=role_name))

    session.commit()