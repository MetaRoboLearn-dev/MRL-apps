from flask import Blueprint, jsonify, request

from database import db_session
from repositories.user_task_log_repository import UserTaskLogRepository
from utils import parse_boolean_param

bp = Blueprint("user_task_logs", __name__, url_prefix="/api/user-task-logs")


def _user_task_log_to_dict(log):
    return {
        "id": log.id,
        "user_started_task_id": log.user_started_task_id,
        "event_type_id": log.event_type_id,
        "created_at": log.created_at.isoformat() if log.created_at else None,
        "code_snapshot": log.code_snapshot,
    }


# ---------- READ ONE ----------
@bp.route("/<int:log_id>", methods=["GET"])
def get_user_task_log(log_id: int):
    with db_session() as session:
        repo = UserTaskLogRepository(session)
        log = repo.get_by_id(log_id)
        if not log:
            return jsonify({"error": "UserTaskLog not found"}), 404
        return jsonify(_user_task_log_to_dict(log)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
def list_user_task_logs():
    # query params: ?skip=0&limit=50&user_started_task_id=1&event_type_id=2&order_by_created_at=true
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 50))

    user_started_task_id_raw = request.args.get("user_started_task_id")
    event_type_id_raw = request.args.get("event_type_id")

    user_started_task_id = int(user_started_task_id_raw) if user_started_task_id_raw is not None else None
    event_type_id = int(event_type_id_raw) if event_type_id_raw is not None else None

    try:
        order_by_created_at = parse_boolean_param(request.args.get("order_by_created_at", "true"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    with db_session() as session:
        repo = UserTaskLogRepository(session)
        logs = repo.list(
            skip=skip,
            limit=limit,
            user_started_task_id=user_started_task_id,
            event_type_id=event_type_id,
            order_by_created_at=order_by_created_at,
        )
        return jsonify([_user_task_log_to_dict(l) for l in logs]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_user_task_log():
    data = request.get_json(silent=True) or {}
    required = ("user_started_task_id",)
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    with db_session() as session:
        repo = UserTaskLogRepository(session)
        log = repo.create(
            user_started_task_id=int(data["user_started_task_id"]),
            event_type_id=int(data["event_type_id"]) if "event_type_id" in data and data["event_type_id"] is not None else None,
            code_snapshot=data.get("code_snapshot"),
        )
        return jsonify(_user_task_log_to_dict(log)), 201


# ---------- DELETE ----------
@bp.route("/<int:log_id>", methods=["DELETE"])
def delete_user_task_log(log_id: int):
    with db_session() as session:
        repo = UserTaskLogRepository(session)
        ok = repo.delete(log_id)
        if not ok:
            return jsonify({"error": "UserTaskLog not found"}), 404
        return jsonify({"deleted": True}), 200