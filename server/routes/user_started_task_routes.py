from __future__ import annotations

from flask import Blueprint, jsonify, request

from database import db_session
from repositories.user_started_task_repository import UserStartedTaskRepository
from utils import parse_boolean_param

bp = Blueprint("user_started_tasks", __name__, url_prefix="/api/user-started-tasks")


def _actor_user_id() -> int | None:
    # Optional: take from header until you wire auth.
    v = request.headers.get("X-Actor-User-Id")
    return int(v) if v and v.isdigit() else None


def _user_started_task_to_dict(ust):
    return {
        "id": ust.id,
        "started_at": ust.started_at.isoformat() if ust.started_at else None,
        "created_at": ust.created_at.isoformat() if ust.created_at else None,
        "updated_at": ust.updated_at.isoformat() if ust.updated_at else None,
        "started_by": ust.started_by,
        "created_by": ust.created_by,
        "updated_by": ust.updated_by,
        "current_value": ust.current_value,
        "activity_id": ust.activity_id,
        "task_id": ust.task_id,
    }


# ---------- READ ONE ----------
@bp.route("/<int:user_started_task_id>", methods=["GET"])
def get_user_started_task(user_started_task_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.get_by_id(user_started_task_id)
        if not ust:
            return jsonify({"error": "UserStartedTask not found"}), 404
        return jsonify(_user_started_task_to_dict(ust)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
def list_user_started_tasks():
    # query params: ?skip=0&limit=50&started_by=1&activity_id=2&task_id=3&order_by_started_at=true
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 50))

    started_by_raw = request.args.get("started_by")
    activity_id_raw = request.args.get("activity_id")
    task_id_raw = request.args.get("task_id")

    started_by = int(started_by_raw) if started_by_raw is not None else None
    activity_id = int(activity_id_raw) if activity_id_raw is not None else None
    task_id = int(task_id_raw) if task_id_raw is not None else None

    try:
        order_by_started_at = parse_boolean_param(request.args.get("order_by_started_at", "true"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        items = repo.list(
            skip=skip,
            limit=limit,
            started_by=started_by,
            activity_id=activity_id,
            task_id=task_id,
            order_by_started_at=order_by_started_at,
        )
        return jsonify([_user_started_task_to_dict(x) for x in items]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_user_started_task():
    data = request.get_json(silent=True) or {}
    required = ("started_by", "activity_id", "task_id")
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.create(
            started_by=int(data["started_by"]),
            activity_id=int(data["activity_id"]),
            task_id=int(data["task_id"]),
            current_value=data.get("current_value"),
            actor_user_id=_actor_user_id(),
        )
        return jsonify(_user_started_task_to_dict(ust)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:user_started_task_id>", methods=["PATCH"])
def update_user_started_task(user_started_task_id: int):
    data = request.get_json(silent=True) or {}

    allowed = {"current_value", "activity_id", "task_id"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.update(
            user_started_task_id,
            current_value=data.get("current_value"),
            activity_id=int(data["activity_id"]) if "activity_id" in data else None,
            task_id=int(data["task_id"]) if "task_id" in data else None,
            actor_user_id=_actor_user_id(),
        )
        if not ust:
            return jsonify({"error": "UserStartedTask not found"}), 404

        return jsonify(_user_started_task_to_dict(ust)), 200


# ---------- DELETE ----------
@bp.route("/<int:user_started_task_id>", methods=["DELETE"])
def delete_user_started_task(user_started_task_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ok = repo.delete(user_started_task_id)
        if not ok:
            return jsonify({"error": "UserStartedTask not found"}), 404
        return jsonify({"deleted": True}), 200