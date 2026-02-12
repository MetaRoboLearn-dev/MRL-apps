from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db
from sb import sb_run_python
from routes import user_routes, task_routes, activity_routes
import models

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:123@localhost:5432/mrl'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

app.register_blueprint(user_routes.bp)
app.register_blueprint(task_routes.bp)
app.register_blueprint(activity_routes.bp)

CORS(app, 
     origins=["http://localhost:3000"],
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type"],
     supports_credentials=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/execute', methods=['POST'])
def execute():
    return jsonify({"status": "ok"}), 200

@app.route('/run-python', methods=['POST'])
def run_python():
    code = request.json.get("code", "")
    return sb_run_python(code)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)