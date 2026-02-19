from flask import Blueprint, jsonify
from database import db_session

from repositories.type_repository import TypeRepository

bp = Blueprint("types", __name__, url_prefix="/api/types")

@bp.route("/", methods=["GET"])
def list_types():
    with db_session() as session:
        repo = TypeRepository(session)
        types = repo.list_all()
        return jsonify([
            {"id": t.id, "name": t.name}
            for t in types
        ]), 200