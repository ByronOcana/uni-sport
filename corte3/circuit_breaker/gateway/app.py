from flask import Flask, request, jsonify
import requests
import time

app = Flask(__name__)



circuito_usuarios = {"fallos": 0, "break": False, "time": 0}
circuito_mascotas = {"fallos": 0, "break": False, "time": 0}



def get_usuarios():
    if circuito_usuarios["break"]:
        if time.time() > circuito_usuarios["time"]:
            circuito_usuarios["break"] = False
            circuito_usuarios["fallos"] = 0
            print("Se hizo un reintento del servicio", flush=True)

        else:
            return {"error": "El servicio esta suspendido temporalmente"}

    try:
        inicio = time.time()
        respuesta = requests.get("http://usuarios:5000/usuarios", timeout=2).json()
        circuito_usuarios["fallos"] = 0
        final = time.time()
        print(f"Han pasado {final - inicio}s")
        return respuesta

    except:
        circuito_usuarios["fallos"] += 1
        print(f"Se intento hacer uso de usuarios, intento: {circuito_usuarios['fallos']}", flush=True)

        if circuito_usuarios["fallos"] >= 2:
            circuito_usuarios["break"] = True
            circuito_usuarios["time"] = time.time() + 10
            print("El servicio de usuarios fue suspendido durante 10s", flush=True)

        return {"error": "No se pudo obtener la info de usuarios, volver a intentar"}



def get_mascotas():
    if circuito_mascotas["break"]:
        if time.time() > circuito_mascotas["time"]:
            circuito_mascotas["break"] = False
            circuito_mascotas["fallos"] = 0
            print("Se hizo un reintento del servicio", flush=True)

        else:
            return {"error": "El servicio esta suspendido temporalmente"}

    try:
        inicio = time.time()
        respuesta = requests.get("http://backend:5000/mascotas", timeout=2).json()
        circuito_mascotas["fallos"] = 0
        final = time.time()
        print(f"Han pasado {final - inicio}s")
        return respuesta
    
    except:
        circuito_mascotas["fallos"] += 1
        print(f"Se intento hacer uso de mascotas, intento: {circuito_mascotas['fallos']}", flush=True)

        if circuito_mascotas["fallos"] >= 2:
            circuito_mascotas["break"] = True
            circuito_mascotas["time"] = time.time() + 10
            print(f"El servicio de mascotas fue suspendido durante 10s", flush=True)

        return {"error": "No se pudo obtener la info de mascotas, volver a intentar"}



@app.route("/usuarios")
def usuarios():
    return jsonify(get_usuarios()), 200



@app.route("/mascotas")
def mascotas():
    return jsonify(get_mascotas()), 200



@app.route("/resumen")
def resumen():
    usuarios = get_usuarios()
    mascotas = get_mascotas()


@app.route("/duenyos/<int:id_duenyo>")
def get_duenyo(id_duenyo):
    try:
        response = requests.get(f"http://backend:5000/duenyos/{id_duenyo}", timeout=2)
        duenyo = response.json()

        if "error" in duenyo:
            return jsonify(duenyo), response.status_code
        
        if response.status_code != 200:
            return jsonify({"error": "Algo salio mal"}), response.status_code

        return jsonify(duenyo), 200
   
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "servicio caido"}), 503
    
    except requests.exceptions.Timeout:
        return jsonify({"error": "se tarda mucho"}), 503


@app.route("/mascotas/health")
def mascotas_health():
    try:
        response = requests.get("http://backend:5000/health", timeout=2)
        health = response.json()
        return jsonify(health), 200
   
    except:
        return jsonify({"error": "Servicio caido"}), 503


@app.route("/usuarios/health")
def usuarios_health():
    try:
        response = requests.get("http://usuarios:5000/health", timeout=2)
        health = response.json()
        return jsonify(health), 200
   
    except:
        return jsonify({"error": "Servicio caido"}), 503


@app.route("/health")
def health():
    return jsonify({
        "menssage": "todo bien"
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)