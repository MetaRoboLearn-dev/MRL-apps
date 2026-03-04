from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from database import db_session
from repositories.sandbox_repository import SandboxRepository

bp = Blueprint("sandbox", __name__, url_prefix="/api/sandbox")

@bp.before_request
@login_required
def require_login():
    pass

@bp.route("/run-python", methods=["POST"])
def run_python():
    data = request.get_json(silent=True) or {}
    code = data.get("code", "")
    value = data.get("code_snapshot", "")
    user_started_task_id = data.get("user_started_task_id")

    with db_session() as session:
        repo = SandboxRepository(session)
        return repo.run_python(
            code=code,
            code_snapshot=value,
            user_started_task_id=user_started_task_id,
        )