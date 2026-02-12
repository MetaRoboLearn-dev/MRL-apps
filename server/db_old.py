from flask import jsonify
from psycopg_pool import ConnectionPool

pool = ConnectionPool("dbname=MRL user=mrl_user password=mrl_user")

def db_log_get():
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM action_logs")
            return cur.fetchall()

def db_log_action(group_name, app_mode, action_type, value):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO action_logs (group_name, app_mode, action_type, value) VALUES (%s, %s, %s, %s)",
                (group_name, app_mode, action_type, value)
            )

    return jsonify({"status": "ok"}), 200