from flask import Flask, request, jsonify
from flask_cors import CORS
from db import db_log_get, db_log_action
from sb import sb_run_python

app = Flask(__name__)
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

@app.route('/log-get', methods=['GET'])
def log_get():
    return db_log_get()

@app.route('/log-action', methods=['POST'])
def log_action():
    group = request.json.get("group", "")
    mode = request.json.get("mode", "")
    action = request.json.get("action", "")
    value = request.json.get("value", "")
    return db_log_action(group, mode, action, value)

@app.route('/run-python', methods=['POST'])
def run_python():
    code = request.json.get("code", "")
    return sb_run_python(code)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)