from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from auth import role_required
from database import db_session
from repositories.user_started_task_repository import UserStartedTaskRepository
from models.user_started_task import UserStartedTask
from utils import parse_boolean_param, _to_utc_iso, utc_now

bp = Blueprint("user_started_tasks", __name__, url_prefix="/api/user-started-tasks")

@bp.before_request
@login_required
def require_login():
    pass  # login_required handles the check, this just needs to exist

def _user_started_task_to_dict(ust):
    if ust.activity_task:
        return {
            "id": ust.id,
            "started_at": _to_utc_iso(ust.started_at),
            "started_by": ust.started_by,
            "current_value": ust.current_value,
            "activity_task": {
                "act_task_id": ust.activity_task_id,
                "task_type": ust.activity_task.type.name if ust.activity_task.type else None,
                "preview": ust.activity_task.preview,
                "instructions": ust.activity_task.instructions,
                "is_logged": ust.activity_task.is_logged,
                "allows_robot": ust.activity_task.allows_robot,
            },
            "task": {
                "id": ust.activity_task.task.id,
                "title": ust.activity_task.task.title,
                "description": ust.activity_task.task.description,
                "size_x": ust.activity_task.task.size_x,
                "size_z": ust.activity_task.task.size_z,
                "start": ust.activity_task.task.start,
                "rotation": ust.activity_task.task.rotation,
                "finish": ust.activity_task.task.finish,
                "barriers": ust.activity_task.task.barriers,
                "stickers": ust.activity_task.task.stickers,
                "code": ust.activity_task.task.code,
                "blocks": ust.activity_task.task.blocks,
                "floor_color": ust.activity_task.task.floor_color,
                "model_path": ust.activity_task.task.model_path,
                "active": getattr(ust.activity_task.task, "active", None),
            },
        }
    else:
        return {
            "id": ust.id,
            "started_at": _to_utc_iso(ust.started_at),
            "started_by": ust.started_by,
            "current_value": ust.current_value,
            "assignment_id": str(ust.assignment_id) if ust.assignment_id else None,
        }

# ---------- READ INFO FOR USER AND ACTIVITY TASK ----------
@bp.route("/activity-task/<int:activity_task_id>", methods=["GET"])
def get_user_started_task_activity_task(activity_task_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.get_by_user_activity_task(activity_task_id, current_user.id)
        if not ust:
            return jsonify({"error": "UserStartedTask not found for that activity task"}), 404

        if ust.is_finished:
            return jsonify({"error": "Task is already finished"}), 400

        activity = ust.activity_task.activity if ust.activity_task else None
        if activity:
            if not activity.active:
                return jsonify({"error": "Activity is no longer active"}), 403
            if activity.time_to and activity.time_to < utc_now():
                return jsonify({"error": "Activity has expired"}), 403

        return jsonify(_user_started_task_to_dict(ust)), 200

@bp.route("/by-assignment/<string:assignment_id>", methods=["GET"])
def get_user_started_task_by_assignment(assignment_id: str):
    with db_session() as session:
        ust = session.query(UserStartedTask).filter_by(
            assignment_id=assignment_id
        ).first()

        if not ust:
            return jsonify({"error": "UserStartedTask not found for that assignment"}), 404

        return jsonify(_user_started_task_to_dict(ust)), 200

# ---------- READ ONE ----------
@bp.route("/<int:user_started_task_id>", methods=["GET"])
@role_required('admin', 'teacher')
def get_user_started_task(user_started_task_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.get_by_id(user_started_task_id)
        if not ust:
            return jsonify({"error": "UserStartedTask not found"}), 404
        return jsonify(_user_started_task_to_dict(ust)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
@role_required('admin', 'teacher')
def list_user_started_tasks():
    # query params: ?skip=0&limit=50&started_by=1&activity_id=2&task_id=3&order_by_started_at=true
    started_by_raw = request.args.get("started_by")
    started_by = int(started_by_raw) if started_by_raw is not None else None

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        items = repo.list(started_by=started_by)
        return jsonify([_user_started_task_to_dict(x) for x in items]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_user_started_task():
    data = request.get_json(silent=True) or {}

    activity_task_id = data.get("activity_task_id")
    assignment_id = data.get("assignment_id")
    initial_code = data.get("initial_code")

    if not activity_task_id and not assignment_id:
        return jsonify({"error": "Either activity_task_id or assignment_id is required"}), 400

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.create(
            activity_task_id=int(activity_task_id) if activity_task_id else None,
            assignment_id=assignment_id or None,
            current_value=initial_code or None,
            actor_user_id=current_user.id,
        )
        return jsonify(_user_started_task_to_dict(ust)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:ust_id>", methods=["PATCH"])
def update_user_started_task(ust_id: int):
    data = request.get_json(silent=True) or {}

    allowed = {"current_value"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.update(
            ust_id,
            current_value=data.get("current_value"),
            actor_user_id=current_user.id,
        )
        if not ust:
            return jsonify({"error": "UserStartedTask not found"}), 404
        return jsonify(_user_started_task_to_dict(ust)), 200


# ---------- DELETE ----------
@bp.route("/<int:user_started_task_id>", methods=["DELETE"])
@role_required('admin', 'teacher')
def delete_user_started_task(user_started_task_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ok = repo.delete(user_started_task_id)
        if not ok:
            return jsonify({"error": "UserStartedTask not found"}), 404
        return jsonify({"deleted": True}), 200


# ---------- FINISH SOLVING ----------
@bp.route("/<int:ust_id>/finish", methods=["POST"])
def finish_task(ust_id: int):
    with db_session() as session:
        repo = UserStartedTaskRepository(session)
        ust = repo.finish(ust_id, actor_user_id=current_user.id)
        if not ust:
            return jsonify({"error": "Not found"}), 404
        return jsonify({"finished": True}), 200