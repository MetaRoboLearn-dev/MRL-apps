import threading
import io
import contextlib
import math
from flask import jsonify

EXEC_TIMEOUT = 2  # seconds
MAX_OUTPUT_LEN = 1024  # 1 KB

def forward(a = 0, b = 0):
    print('naprijed')

def back(a = 0, b = 0):
    print('nazad')

def turn_left(a = 0, b = 0):
    print('lijevo')

def turn_right(a = 0, b = 0):
    print('desno')

safe_builtins = {
    "forward": forward,
    "back": back,
    "turn_left": turn_left,
    "turn_right": turn_right,
    "abs": abs,
    "bool": bool,
    "dict": dict,
    "enumerate": enumerate,
    "float": float,
    "int": int,
    "len": len,
    "list": list,
    "max": max,
    "min": min,
    "range": range,
    "set": set,
    "str": str,
    "sum": sum,
    "zip": zip,
    "math": math,
}

def run_user_code(code: str, output: io.StringIO, error: io.StringIO):
    try:
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(error):
            exec(code, {"__builtins__": {}}, safe_builtins)
    except Exception as e:
        error.write(f"{type(e).__name__}: {str(e)}\n")

def sb_run_python(code):
    if "import" in code:
        return jsonify({"error": "Import statements are not allowed."}), 400

    stdout = io.StringIO()
    stderr = io.StringIO()

    thread = threading.Thread(target=run_user_code, args=(code, stdout, stderr))
    thread.start()
    thread.join(EXEC_TIMEOUT)

    if thread.is_alive():
        return jsonify({
            "output": stdout.getvalue()[:MAX_OUTPUT_LEN],
            "error": f"Execution timed out after {EXEC_TIMEOUT} seconds."
        }), 408

    output = stdout.getvalue()
    error = stderr.getvalue()

    # Truncate output if needed
    if len(output) > MAX_OUTPUT_LEN:
        output = output[:MAX_OUTPUT_LEN] + "\n...[output truncated]"

    return jsonify({
        "output": output,
        "error": error
    })