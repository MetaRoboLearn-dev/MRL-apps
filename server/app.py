from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db
from sb import sb_run_python
from auth import init_auth
from routes import user_routes, task_routes, activity_routes, activity_task_routes, user_started_task_routes, \
    user_task_log_routes, type_routes, broker_routes, auth_routes
import models

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:123@localhost:5432/mrl'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "change-me-to-a-real-secret"  # needed for flask_login sessions

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_PATH="/",
    REMEMBER_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_SAMESITE="Lax",
)

init_db(app)
init_auth(app)

app.register_blueprint(auth_routes.bp)
app.register_blueprint(user_routes.bp)
app.register_blueprint(task_routes.bp)
app.register_blueprint(activity_routes.bp)
app.register_blueprint(activity_task_routes.bp)
app.register_blueprint(user_started_task_routes.bp)
app.register_blueprint(user_task_log_routes.bp)
app.register_blueprint(type_routes.bp)

app.register_blueprint(broker_routes.bp)
broker_routes.init_broker_websocket(app)

CORS(app,
     origins=["http://localhost:3000"],
     methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],  # added PATCH/DELETE
     allow_headers=["Content-Type"],
     supports_credentials=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/execute', methods=['POST'])
def execute():
    return jsonify({"status": "ok"}), 200

@app.route('/api/run-python', methods=['POST'])
def run_python():
    code = request.json.get("code", "")
    return sb_run_python(code)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)