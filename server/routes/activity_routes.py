import datetime
from flask import Blueprint, jsonify, request

from database import db_session
from repositories.activity_repository import ActivityRepository
from utils import parse_boolean_param, parse_datetime

bp = Blueprint("activities", __name__, url_prefix="/api/activities")


def _actor_user_id() -> int | None:
    # Optional: take from header until you wire auth.
    v = request.headers.get("X-Actor-User-Id")
    return int(v) if v and v.isdigit() else None

def _activity_to_dict(a):
    return {
        "id": a.id,
        "title": a.title,
        "description": a.description,
        "time_from": a.time_from.isoformat() if a.time_from else None,
        "time_to": a.time_to.isoformat() if a.time_to else None,
        "active": getattr(a, "active", None),
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "updated_at": a.updated_at.isoformat() if a.updated_at else None,
        "created_by": a.created_by,
        "updated_by": a.updated_by,
    }


# ---------- READ ONE ----------
@bp.route("/<int:activity_id>", methods=["GET"])
def get_activity(activity_id: int):
    with db_session() as session:
        repo = ActivityRepository(session)
        activity = repo.get_by_id(activity_id)
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        return jsonify(_activity_to_dict(activity)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
def list_activities():
    # query params: ?skip=0&limit=50&active_only=true&search=yoga&order_by_time_from=true
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 50))

    try:
        active_only = parse_boolean_param(request.args.get("active_only"))
        order_by_time_from = parse_boolean_param(request.args.get("order_by_time_from", "true"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    search = request.args.get("search")

    with db_session() as session:
        repo = ActivityRepository(session)
        activities = repo.list(
            skip=skip,
            limit=limit,
            active_only=active_only,
            search=search,
            order_by_time_from=order_by_time_from,
        )
        return jsonify([_activity_to_dict(a) for a in activities]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_activity():
    data = request.get_json(silent=True) or {}
    required = ("title", "time_from", "time_to")
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    try:
        time_from = parse_datetime(data["time_from"])
        time_to = parse_datetime(data["time_to"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    with db_session() as session:
        repo = ActivityRepository(session)
        activity = repo.create(
            title=data["title"],
            description=data.get("description"),
            time_from=time_from,
            time_to=time_to,
            actor_user_id=_actor_user_id(),
        )
        return jsonify(_activity_to_dict(activity)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:activity_id>", methods=["PATCH"])
def update_activity(activity_id: int):
    data = request.get_json(silent=True) or {}

    # allow only these fields to be updated through this endpoint
    allowed = {"title", "description", "time_from", "time_to", "active"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    # parse datetimes if provided
    try:
        time_from = parse_datetime(data["time_from"]) if "time_from" in data else None
        time_to = parse_datetime(data["time_to"]) if "time_to" in data else None
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    with db_session() as session:
        repo = ActivityRepository(session)
        activity = repo.update(
            activity_id,
            title=data.get("title"),
            description=data.get("description"),
            time_from=time_from,
            time_to=time_to,
            active=data.get("active"),
            actor_user_id=_actor_user_id(),
        )
        if not activity:
            return jsonify({"error": "Activity not found"}), 404

        return jsonify(_activity_to_dict(activity)), 200


# ---------- DEACTIVATE ----------
@bp.route("/<int:activity_id>/deactivate", methods=["POST"])
def deactivate_activity(activity_id: int):
    with db_session() as session:
        repo = ActivityRepository(session)
        activity = repo.deactivate(activity_id, actor_user_id=_actor_user_id())
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        return jsonify(_activity_to_dict(activity)), 200


# ---------- ACTIVATE ----------
@bp.route("/<int:activity_id>/activate", methods=["POST"])
def activate_activity(activity_id: int):
    with db_session() as session:
        repo = ActivityRepository(session)
        activity = repo.activate(activity_id, actor_user_id=_actor_user_id())
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        return jsonify(_activity_to_dict(activity)), 200


# ---------- DELETE ----------
@bp.route("/<int:activity_id>", methods=["DELETE"])
def delete_activity(activity_id: int):
    with db_session() as session:
        repo = ActivityRepository(session)
        ok = repo.delete(activity_id)
        if not ok:
            return jsonify({"error": "Activity not found"}), 404
        return jsonify({"deleted": True}), 200