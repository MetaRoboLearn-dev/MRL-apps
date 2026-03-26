from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from auth import role_required
from database import db_session
from repositories.badge_repository import BadgeRepository
from utils import _to_utc_iso

bp = Blueprint("badges", __name__, url_prefix="/api/badges")

@bp.before_request
@login_required
def require_login():
    pass

def _badge_to_dict(badge):
    return {
        "id": badge.id,
        "title": badge.title,
        "description": badge.description,
        "value": badge.value,
        "image_url": badge.image_url,
        "created_at": _to_utc_iso(badge.created_at),
        "updated_at": _to_utc_iso(badge.updated_at),
        "created_by": badge.created_by,
        "updated_by": badge.updated_by,
    }


# ---------- READ ONE ----------
@bp.route("/<int:badge_id>", methods=["GET"])
@role_required('admin', 'teacher')
def get_badge(badge_id: int):
    with db_session() as session:
        repo = BadgeRepository(session)
        badge = repo.get_by_id(badge_id)
        if not badge:
            return jsonify({"error": "Badge not found"}), 404
        return jsonify(_badge_to_dict(badge)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
@role_required('admin', 'teacher')
def list_badges():
    search = request.args.get("search")

    with db_session() as session:
        repo = BadgeRepository(session)
        badges = repo.list(search=search)
        return jsonify([_badge_to_dict(b) for b in badges]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
@role_required('admin', 'teacher')
def create_badge():
    data = request.get_json(silent=True) or {}

    required = ("title", "value", "image_url")
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    with db_session() as session:
        repo = BadgeRepository(session)
        badge = repo.create(
            title=data["title"],
            description=data.get("description"),
            value=data["value"],
            image_url=data["image_url"],
            actor_user_id=current_user.id,
        )
        return jsonify(_badge_to_dict(badge)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:badge_id>", methods=["PATCH"])
@role_required('admin', 'teacher')
def update_badge(badge_id: int):
    data = request.get_json(silent=True) or {}

    allowed = {"title", "description", "value", "image_url"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    with db_session() as session:
        repo = BadgeRepository(session)
        badge = repo.update(
            badge_id,
            title=data.get("title"),
            description=data.get("description"),
            value=data.get("value"),
            image_url=data.get("image_url"),
            actor_user_id=current_user.id,
        )
        if not badge:
            return jsonify({"error": "Badge not found"}), 404

        return jsonify(_badge_to_dict(badge)), 200


# ---------- DELETE ----------
@bp.route("/<int:badge_id>", methods=["DELETE"])
@role_required('admin', 'teacher')
def delete_badge(badge_id: int):
    with db_session() as session:
        repo = BadgeRepository(session)
        ok = repo.delete(badge_id)
        if not ok:
            return jsonify({"error": "Badge not found"}), 404
        return jsonify({"deleted": True}), 200