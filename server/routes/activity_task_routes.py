from flask import Blueprint, jsonify, request

from database import db_session
from repositories.activity_task_repository import ActivityTaskRepository
from utils import parse_boolean_param

bp = Blueprint("activity_tasks", __name__, url_prefix="/api/activity-tasks")


def _actor_user_id() -> int | None:
    # Optional: take from header until you wire auth.
    v = request.headers.get("X-Actor-User-Id")
    return int(v) if v and v.isdigit() else None


def _activity_task_to_dict(at):
    return {
        "id": at.id,
        "description": at.description,
        "activity_id": at.activity_id,
        "task_id": at.task_id,
        "type_id": at.type_id,
        "order": at.order,
        "created_at": at.created_at.isoformat() if at.created_at else None,
        "updated_at": at.updated_at.isoformat() if at.updated_at else None,
        "created_by": at.created_by,
        "updated_by": at.updated_by,
    }


# ---------- READ ONE ----------
@bp.route("/<int:activity_task_id>", methods=["GET"])
def get_activity_task(activity_task_id: int):
    with db_session() as session:
        repo = ActivityTaskRepository(session)
        at = repo.get_by_id(activity_task_id)
        if not at:
            return jsonify({"error": "ActivityTask not found"}), 404
        return jsonify(_activity_task_to_dict(at)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
def list_activity_tasks():
    # query params: ?skip=0&limit=50&activity_id=1&task_id=2&type_id=3&order_by_order=true
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 50))

    activity_id_raw = request.args.get("activity_id")
    task_id_raw = request.args.get("task_id")
    type_id_raw = request.args.get("type_id")

    activity_id = int(activity_id_raw) if activity_id_raw is not None else None
    task_id = int(task_id_raw) if task_id_raw is not None else None
    type_id = int(type_id_raw) if type_id_raw is not None else None

    try:
        order_by_order = parse_boolean_param(request.args.get("order_by_order", "true"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    with db_session() as session:
        repo = ActivityTaskRepository(session)
        items = repo.list(
            skip=skip,
            limit=limit,
            activity_id=activity_id,
            task_id=task_id,
            type_id=type_id,
            order_by_order=order_by_order,
        )
        return jsonify([_activity_task_to_dict(x) for x in items]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_activity_task():
    data = request.get_json(silent=True) or {}
    required = ("activity_id", "task_id", "type_id", "order")
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    with db_session() as session:
        repo = ActivityTaskRepository(session)
        at = repo.create(
            activity_id=int(data["activity_id"]),
            task_id=int(data["task_id"]),
            type_id=int(data["type_id"]),
            order=int(data["order"]),
            description=data.get("description"),
            actor_user_id=_actor_user_id(),
        )
        return jsonify(_activity_task_to_dict(at)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:activity_task_id>", methods=["PATCH"])
def update_activity_task(activity_task_id: int):
    data = request.get_json(silent=True) or {}

    # allow only these fields to be updated through this endpoint
    allowed = {"description", "activity_id", "task_id", "type_id", "order"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    with db_session() as session:
        repo = ActivityTaskRepository(session)
        at = repo.update(
            activity_task_id,
            description=data.get("description"),
            activity_id=int(data["activity_id"]) if "activity_id" in data else None,
            task_id=int(data["task_id"]) if "task_id" in data else None,
            type_id=int(data["type_id"]) if "type_id" in data else None,
            order=int(data["order"]) if "order" in data else None,
            actor_user_id=_actor_user_id(),
        )
        if not at:
            return jsonify({"error": "ActivityTask not found"}), 404

        return jsonify(_activity_task_to_dict(at)), 200


# ---------- DELETE ----------
@bp.route("/<int:activity_task_id>", methods=["DELETE"])
def delete_activity_task(activity_task_id: int):
    with db_session() as session:
        repo = ActivityTaskRepository(session)
        ok = repo.delete(activity_task_id)
        if not ok:
            return jsonify({"error": "ActivityTask not found"}), 404
        return jsonify({"deleted": True}), 200