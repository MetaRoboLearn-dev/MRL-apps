import os
import json
import requests
import websocket
from flask import Blueprint, jsonify, request
from flask_login import login_required
from flask_sock import Sock
from functools import wraps
import threading

bp = Blueprint("broker", __name__, url_prefix="/api/broker")

@bp.before_request
@login_required
def require_login():
    pass  # login_required handles the check, this just needs to exist

sock = Sock()

BROKER_URL = os.environ.get("BROKER_API_URL", "http://localhost:8000")
BROKER_WS_URL = os.environ.get("BROKER_WS_URL", "ws://localhost:8000")
BROKER_CLIENT_NAME = os.environ.get("BROKER_CLIENT_NAME", "mrl-app-server")
BROKER_API_KEY = os.environ.get("BROKER_API_KEY", "")

_broker_state = {
    "client_id": None,
    "token": None,
}


def _ensure_logged_in(force=False):
    if _broker_state["token"] and not force:
        return

    res = requests.post(f"{BROKER_URL}/client/login", headers={
        "Content-Type": "application/json",
        "client-name": BROKER_CLIENT_NAME,
        "api-key": BROKER_API_KEY,
    })
    res.raise_for_status()
    data = res.json()
    _broker_state["client_id"] = data["ClientId"]
    _broker_state["token"] = data["Token"]


def broker_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        for attempt in range(2):
            try:
                _ensure_logged_in(force=(attempt > 0))
            except Exception as e:
                return jsonify({"error": f"Broker login failed: {str(e)}"}), 502
            try:
                return f(*args, **kwargs)
            except requests.HTTPError as e:
                if e.response is not None and e.response.status_code in (401, 403) and attempt == 0:
                    _broker_state["token"] = None
                    continue
                return jsonify({"error": f"Broker request failed: {str(e)}"}), 502
            except Exception as e:
                return jsonify({"error": f"Broker request failed: {str(e)}"}), 502
    return decorated


def _broker_headers():
    return {
        "Content-Type": "application/json",
        "client-id": _broker_state["client_id"],
        "token": _broker_state["token"],
    }


# ---------- TEST CONNECTION ----------
@bp.route("/test", methods=["GET"])
def test_connection():
    try:
        _ensure_logged_in(force=True)
        return jsonify({
            "status": "ok",
            "client_id": _broker_state["client_id"],
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 502


# ---------- LIST ROBOTS ----------
@bp.route("/robots", methods=["GET"])
@broker_auth
def list_robots():
    res = requests.get(f"{BROKER_URL}/client/robot/info", headers=_broker_headers())
    res.raise_for_status()
    return jsonify(res.json()), 200


# ---------- SEND COMMAND ----------
# TODO - ovo treba bit dostupno samo kad ima aktivnost koja trenutno traje ili ako si teacher/admin
@bp.route("/robots/<robot_id>/command", methods=["POST"])
@broker_auth
def send_command(robot_id: str):
    data = request.get_json(silent=True) or {}
    code = data.get("code", "")
    if not code:
        return jsonify({"error": "code is required"}), 400

    res = requests.post(
        f"{BROKER_URL}/robot/{robot_id}/command",
        headers=_broker_headers(),
        json={
            "CommandType": "CODE",
            "CodeText": code,
        },
    )
    res.raise_for_status()
    return jsonify(res.json()), 200

# ---------- ABORT COMMAND ----------
# TODO - ovo treba bit dostupno samo kad ima aktivnost koja trenutno traje ili ako si teacher/admin
@bp.route("/robots/<robot_id>/abort", methods=["POST"])
@broker_auth
def abort_command(robot_id: str):
    res = requests.post(
        f"{BROKER_URL}/robot/{robot_id}/command",
        headers=_broker_headers(),
        json={
            "CommandType": "ABORT",
        },
    )
    res.raise_for_status()
    return jsonify(res.json()), 200


# ---------- WEBSOCKET PROXY ----------
def init_broker_websocket(app):
    sock.init_app(app)

    @sock.route("/api/broker/robots/<robot_id>/logs")
    def robot_logs_proxy(ws, robot_id):
        print(f"[WS] Connection attempt for robot {robot_id}")
        try:
            _ensure_logged_in()
        except Exception as e:
            ws.send(json.dumps({"LogLevel": "ERROR", "Message": f"Broker login failed: {str(e)}"}))
            ws.close()
            return

        broker_ws = None
        closed = threading.Event()

        def on_broker_message(_, message):
            if not closed.is_set():
                try:
                    ws.send(message)
                except Exception:
                    closed.set()

        def on_broker_error(_, error):
            if not closed.is_set():
                try:
                    ws.send(json.dumps({"LogLevel": "ERROR", "Message": str(error)}))
                except Exception:
                    pass
            closed.set()

        def on_broker_close(_, close_status_code, close_msg):
            closed.set()

        broker_ws = websocket.WebSocketApp(
            f"{BROKER_WS_URL}/client/robot-log/{robot_id}",
            header={
                "client-id": str(_broker_state["client_id"]),
                "token": str(_broker_state["token"]),
            },
            on_message=on_broker_message,
            on_error=on_broker_error,
            on_close=on_broker_close,
        )

        broker_thread = threading.Thread(target=broker_ws.run_forever, daemon=True)
        broker_thread.start()

        try:
            while not closed.is_set():
                try:
                    ws.receive(timeout=1)
                except Exception:
                    break
        finally:
            closed.set()
            if broker_ws:
                broker_ws.close()

    @sock.route("/api/broker/robots/<robot_id>/stdout")
    def robot_stdout_proxy(ws, robot_id):
        print(f"[WS] stdout connection attempt for robot {robot_id}")
        try:
            _ensure_logged_in()
        except Exception as e:
            ws.send(json.dumps({"error": f"Broker login failed: {str(e)}"}))
            ws.close()
            return

        broker_ws = None
        closed = threading.Event()

        def on_broker_message(_, message):
            if not closed.is_set():
                try:
                    ws.send(message)
                except Exception:
                    closed.set()

        def on_broker_error(_, error):
            if not closed.is_set():
                try:
                    ws.send(json.dumps({"error": str(error)}))
                except Exception:
                    pass
            closed.set()

        def on_broker_close(_, close_status_code, close_msg):
            closed.set()

        broker_ws = websocket.WebSocketApp(
            f"{BROKER_WS_URL}/client/robot-print/{robot_id}",
            header={
                "client-id": str(_broker_state["client_id"]),
                "token": str(_broker_state["token"]),
            },
            on_message=on_broker_message,
            on_error=on_broker_error,
            on_close=on_broker_close,
        )

        broker_thread = threading.Thread(target=broker_ws.run_forever, daemon=True)
        broker_thread.start()

        try:
            while not closed.is_set():
                try:
                    ws.receive(timeout=1)
                except Exception:
                    break
        finally:
            closed.set()
            if broker_ws:
                broker_ws.close()