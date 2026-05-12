from flask import Flask, request, jsonify
import requests


app = Flask(__name__)



circuito_usuarios = {"fallos": 0, "break": False}
circuito_mascotas = {"fallos": 0, "break": False}



def get_usuarios():
    if circuito_usuarios["break"]:
        return {"error": "El servicio esta suspendido temporalmente"}

    try:
        respuesta = requests.get("http://usuarios:5000/usuarios", timeout=2).json()
        circuito_usuarios["fallos"] = 0
        return respuesta

    except:
        circuito_usuarios["fallos"] += 1
        print(f"Se intento hacer uso de usuarios, intento: {circuito_usuarios['fallos']}", flush=True)

        if circuito_usuarios["fallos"] >= 3:
            circuito_usuarios["break"] = True
            print("El servicio de usuarios fue suspendido", flush=True)

        return {"error": "No se pudo obtener la info de usuarios, volver a intentar"}



def get_mascotas():
    if circuito_mascotas["break"]:
        return {"error": "El servicio esta suspendido temporalmente"}

    try:
        respuesta = requests.get("http://backend:5000/mascotas", timeout=2).json()
        circuito_mascotas["fallos"] = 0
        return respuesta
    
    except:
        circuito_mascotas["fallos"] += 1
        print(f"Se intento hacer uso de mascotas, intento: {circuito_mascotas['fallos']}", flush=True)

        if circuito_mascotas["fallos"] >= 3:
            circuito_mascotas["break"] = True
            print("El servicio de mascotas fue suspendido", flush=True)

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

    return jsonify({"usuarios": usuarios, "mascotas": mascotas}), 200



@app.route("/mascotas/<int:id_mascota>")
def mascota(id_mascota):
    try:
        response = requests.get(f"http://backend:5000/mascotas/{id_mascota}", timeout=2)
        mascotas = response.json()

        if "error" in mascotas:
            return jsonify(mascotas), response.status_code

        if response.status_code != 200:
            return jsonify({"error": "Algo salio mal"}), response.status_code

        for mascota in mascotas:
            if mascota["id"] == id_mascota:
                return jsonify(mascota), 200

        return jsonify({"error": "Mascota no encontrada"}), 404
   
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "servicio caido"}), 503

    except requests.exceptions.Timeout:
        return jsonify({"error": "se tarda mucho"}), 503
        


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)