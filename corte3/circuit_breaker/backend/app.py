from flask import Flask, request, jsonify
import mysql.connector
import os
import requests

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(
       host = os.getenv("PMA_HOST"),
       user = os.getenv("MYSQL_USER"),
       password = os.getenv("MYSQL_PASSWORD"),
       database = os.getenv("MYSQL_DATABASE"),
       port = os.getenv("PMA_PORT")
    )

@app.route("/duenyos/<int:id>")
def relacion(id):
    try:
        usuarios = requests.get(f"http://usuarios:5000/usuarios/{id}").json()
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT nombre FROM mascotas WHERE duenyo_id = %s", (id,))
        mascotas = cursor.fetchall()
        connection.close()
        
        if "error" in usuarios:
            return jsonify({"error": f"no existe el duenyo {id}"}), 404

        nombre_usuario = usuarios["nombre"]
        nombres_mascotas = []

        if mascotas:
            nombres_mascotas = [mascota["nombre"] for mascota in mascotas]

        return jsonify({
            "usuario": nombre_usuario,
            "mascotas": nombres_mascotas
        }), 200

    except:
        return {"error": "el servicio esta caido"}

@app.route("/")
def home():
    return "API FUNCIONANDO"

@app.route("/mascotas", methods=["POST"])
def crear_mascotas():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO mascotas (nombre, tipo, duenyo_id) VALUES (%s, %s, %s)",
        (data["nombre"], data["tipo"], data["duenyo_id"])
    )
    connection.commit()
    connection.close()
    return jsonify({"mensaje": "mascota creada"}), 200


@app.route("/mascotas", methods=["GET"])
def listar_mascotas():
    connection = get_connection()
    cursor= connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM mascotas")
    mascotas = cursor.fetchall()
    connection.close()

    if not mascotas:
        return jsonify({"error": f"no hay mascotas"}), 404

    return jsonify(mascotas), 200


@app.route("/mascotas/<int:id_mascota>", methods=["GET"])
def get_mascota(id_mascota):
    connection = get_connection()
    cursor= connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM mascotas WHERE id = {id_mascota}")
    mascotas = cursor.fetchall()
    connection.close()

    if not mascotas:
        return jsonify({"error": f"no existe la mascota {id_mascota}"}), 404

    return jsonify(mascotas), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)