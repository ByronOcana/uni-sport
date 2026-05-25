from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_connection():
    return mysql.connector.connect(
        host="db",
        user="admin",
        password="admin",
        database="db",
        port="3306"
    )

@app.route("/apuestas/usuario/<int:usuario_id>")
def get_modules(usuario_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(f"""
        SELECT evento, monto, cuota, resultado, fecha FROM apuestas
        WHERE usuario_id = {usuario_id}
    """)

    modules = cursor.fetchall()
    conn.close()

    return jsonify(modules)

@app.route("/health")
def health():
    return jsonify({
        "Servicio": "API Apuestas",
        "status": "ok"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)