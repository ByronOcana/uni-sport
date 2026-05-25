from flask import Flask, jsonify
import mysql.connector
app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(
        host="db",
        user="admin",
        password="admin",
        database="db",
        port="3306"
    )

@app.route("/")
def info():
    return jsonify({
        "endpoints": [
            "/eventos",
            "/evento/<int:evento_id>"
        ]
    })


@app.route("/eventos")
def get_eventos():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            nombre,
            deporte,
            fecha,
            lugar,
            estado
        FROM eventos
        ORDER BY fecha ASC
    """)

    eventos = cursor.fetchall()

    # agregar equipos a cada evento
    for evento in eventos:

        cursor.execute("""
            SELECT nombre
            FROM equipos_evento
            WHERE id_evento = %s
        """, (evento["id"],))

        equipos = cursor.fetchall()

        evento["equipos"] = [e["nombre"] for e in equipos]

    conn.close()

    return jsonify({
        "eventos": eventos
    })


@app.route("/evento/<int:evento_id>")
def get_evento(evento_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            nombre,
            deporte,
            fecha,
            lugar,
            estado
        FROM eventos
        WHERE id = %s
    """, (evento_id,))

    evento = cursor.fetchone()

    if not evento:
        return jsonify({
            "error": "Evento no encontrado"
        }), 404

    cursor.execute("""
        SELECT nombre
        FROM equipos_evento
        WHERE id_evento = %s
    """, (evento_id,))

    equipos = cursor.fetchall()

    evento["equipos"] = [e["nombre"] for e in equipos]

    conn.close()

    return jsonify(evento)


@app.route("/health")
def health_check():
    return jsonify({
        "Servicio": "Eventos",
        "status": "OK"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)