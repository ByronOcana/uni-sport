from flask import Flask, jsonify, request
from flask_cors import CORS 
import mysql.connector
import requests
from time import time

app = Flask(__name__)
CORS(app)

def get_connection():
    return mysql.connector.connect(
        host = "db",
        user = "admin",
        password = "admin",
        database = "db",
        port = "3306"
    )


errores = {
    'usuarios': 0,
    'transacciones': 0,
    'usuario-id': 0,
    'transaccion-id': 0,
    'transacciones-usuario': 0

}


def check_servicio(url_servicio, nombre):
    tiempo_inicio = time()
    respuesta = None

    try:
        print(f"[{nombre}]: Se inicio la peticion de servicio interno de {nombre}", flush=True)
        response = requests.get(url_servicio, timeout=2)    
        print(f"[{nombre}]: El servicio respondio a la peticion", flush=True)
        respuesta = response.json()

    except requests.exceptions.Timeout:
        print(f"[{nombre}: ERROR]: El servicio demora mucho en responder", flush=True)
        respuesta = {"error": "El servicio esta demorando mucho"}
        errores[nombre]  += 1

    except requests.exceptions.ConnectionError:
        print(f"[{nombre}: ERROR]: No se a podido hacer una conexcion con el serivicio", flush=True)
        respuesta = {"error": "El servicio no esta disponible"}
        errores[nombre]  += 1

    finally:
        tiempo_final = time()
        print(f"[{nombre}] El servicio se ha demorando {tiempo_final - tiempo_inicio}seg \n\n", flush=True)

    return respuesta



@app.route("/")
def get_info():
    return jsonify({
            "api-transacciones": check_servicio("http://api-transacciones:5001", "transacciones"),
            "api-usuarios": check_servicio("http://api-usuarios:5002", "usuarios")
        })


@app.route("/usuarios")
def get_usuarios():
    return jsonify(check_servicio("http://api-usuarios:5002/usuarios", "usuarios"))


@app.route("/usuario/<int:usuario_id>")
def get_usuario(usuario_id):
    return jsonify(check_servicio(f"http://api-usuarios:5002/usuario/{usuario_id}", "usuario-id"))


@app.route("/transacciones")
def get_transacciones():
    return jsonify(check_servicio("http://api-transacciones:5001/transacciones", "transacciones"))


@app.route("/transaccion/<int:transaccion_id>")
def get_transaccion(transaccion_id):
    return check_servicio(f"http://api-transacciones:5001/transaccion/{transaccion_id}", "transaccion-id")


@app.route("/transacciones/usuario/<int:usuario_id>")
def get_transacciones_usuario(usuario_id):
    return check_servicio(f"http://api-transacciones:5001/transacciones/usuario/{usuario_id}", "transacciones-usuario")


@app.route("/usuario/auth", methods=["POST"])
def auth():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON"},400) 
        resp = requests.post("http://api-usuarios:5002/auth", json=data, timeout=5)
        return jsonify(resp.json())
    except requests.exceptions.ConnectionError:
        print("Error de conexión con api-usuarios", flush=True)
        return jsonify({"error": "Servicio no disponible"}, 503)
    except requests.exceptions.Timeout:
        print("Tiempo de espera agotado para api-usuarios", flush=True)
        return jsonify({"error": "Tiempo de espera agotado"}, 503)


@app.route("/modules")
def modules():
    resp = requests.get("http://api-modules:5003/modules")
    return jsonify(resp.json()), resp.status_code


@app.route("/registro", methods=["POST"])
def registro():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON"}), 400
        resp = requests.post("http://api-usuarios:5002/registro", json=data, timeout=5)
        return jsonify(resp.json())
    except requests.exceptions.ConnectionError:
        print("Error de conexión con api-usuarios", flush=True)
        return jsonify({"error":"Servicio no disponible"}, 503)
    except requests.exceptions.Timeout:
        print("Tiempo de espera agotado para api-usuarios", flush=True)
        return jsonify({"error": "Tiempo de espera agotado"}, 503)

@app.route("/health")
def health():
    return jsonify({
        "Servicio": "Gateway",
        "status": "OK 😘",
        })

@app.route("/metricas")
def metricas():
    servicios = {
        'usuarios': check_servicio("http://api-usuarios:5002/health", "usuarios"),
        'transacciones': check_servicio("http://api-transacciones:5001/health", "transacciones"),
        'modules': check_servicio("http://api-modules:5003/health", "modules"),
    }
    return jsonify(servicios)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
