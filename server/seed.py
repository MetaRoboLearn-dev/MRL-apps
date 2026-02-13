from sqlalchemy import select
from models import Role, Type


def seed_roles(session):
    existing = session.execute(select(Role.name)).scalars().all()

    default_roles = ["admin", "teacher", "student"]

    for role_name in default_roles:
        if role_name not in existing:
            session.add(Role(name=role_name))

    session.commit()

def seed_types(session):
    existing = session.execute(select(Type.name)).scalars().all()

    default_types = ["python", "blockly"]

    for type_name in default_types:
        if type_name not in existing:
            session.add(Type(name=type_name))

    session.commit()