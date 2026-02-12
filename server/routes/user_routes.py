from flask import Blueprint, jsonify, request
from database import db_session
from repositories.user_repository import UserRepository
from utils import parse_boolean_param

bp = Blueprint("users", __name__, url_prefix="/api/users")


def _actor_user_id() -> int | None:
    # Optional: take from header until you wire auth.
    v = request.headers.get("X-Actor-User-Id")
    return int(v) if v and v.isdigit() else None


def _user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role_id": user.role_id,
        "active": getattr(user, "active", None),
        "last_login": user.last_login.isoformat() if user.last_login else None,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "created_by": user.created_by,
        "updated_by": user.updated_by,
    }


# ---------- READ ONE ----------
@bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id: int):
    with db_session() as session:
        repo = UserRepository(session)
        user = repo.get_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(_user_to_dict(user)), 200


# ---------- LIST ----------
@bp.route("/", methods=["GET"])
def list_users():
    # query params: ?skip=0&limit=50&role_id=2&active_only=true&search=marta&order_by_username=true
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 50))

    role_id_raw = request.args.get("role_id")
    role_id = int(role_id_raw) if role_id_raw is not None else None

    try:
        active_only = parse_boolean_param(request.args.get("active_only"))
        order_by_username = parse_boolean_param(request.args.get("order_by_username", "true"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    search = request.args.get("search")

    with db_session() as session:
        repo = UserRepository(session)
        users = repo.list(
            skip=skip,
            limit=limit,
            role_id=role_id,
            active_only=active_only,
            search=search,
            order_by_username=order_by_username,
        )
        return jsonify([_user_to_dict(u) for u in users]), 200


# ---------- CREATE ----------
@bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json(silent=True) or {}
    required = ("username", "password_hash", "first_name", "last_name", "role_id")
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 400

    with db_session() as session:
        repo = UserRepository(session)

        if repo.exists_username(data["username"]):
            return jsonify({"error": "Username already exists"}), 409

        user = repo.create(
            username=data["username"],
            password_hash=data["password_hash"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            role_id=int(data["role_id"]),
            actor_user_id=_actor_user_id(),
        )
        return jsonify(_user_to_dict(user)), 201


# ---------- UPDATE (PATCH) ----------
@bp.route("/<int:user_id>", methods=["PATCH"])
def update_user(user_id: int):
    data = request.get_json(silent=True) or {}

    # allow only these fields to be updated through this endpoint
    allowed = {"username", "first_name", "last_name", "role_id", "password_hash"}
    unknown = [k for k in data.keys() if k not in allowed]
    if unknown:
        return jsonify({"error": "Unknown fields", "unknown": unknown}), 400

    with db_session() as session:
        repo = UserRepository(session)

        # if username change requested, check availability
        if "username" in data:
            existing = repo.get_by_username(data["username"])
            if existing and existing.id != user_id:
                return jsonify({"error": "Username already exists"}), 409

        user = repo.update(
            user_id,
            username=data.get("username"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            role_id=int(data["role_id"]) if "role_id" in data else None,
            password_hash=data.get("password_hash"),
            actor_user_id=_actor_user_id(),
        )
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(_user_to_dict(user)), 200


# ---------- UPDATE LAST LOGIN ----------
@bp.route("/<int:user_id>/last-login", methods=["POST"])
def update_last_login(user_id: int):
    with db_session() as session:
        repo = UserRepository(session)
        user = repo.update_last_login(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(_user_to_dict(user)), 200


# ---------- DEACTIVATE ----------
@bp.route("/<int:user_id>/deactivate", methods=["POST"])
def deactivate_user(user_id: int):
    with db_session() as session:
        repo = UserRepository(session)
        user = repo.deactivate(user_id, actor_user_id=_actor_user_id())
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(_user_to_dict(user)), 200


# ---------- ACTIVATE ----------
@bp.route("/<int:user_id>/activate", methods=["POST"])
def activate_user(user_id: int):
    with db_session() as session:
        repo = UserRepository(session)
        user = repo.activate(user_id, actor_user_id=_actor_user_id())
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(_user_to_dict(user)), 200


# ---------- DELETE ----------
@bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id: int):
    with db_session() as session:
        repo = UserRepository(session)
        ok = repo.delete(user_id)
        if not ok:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"deleted": True}), 200


# ---------- EXISTS USERNAME ----------
@bp.route("/exists/<string:username>", methods=["GET"])
def username_exists(username: str):
    with db_session() as session:
        repo = UserRepository(session)
        return jsonify({"username": username, "exists": repo.exists_username(username)}), 200