from flask import Flask, request, jsonify
import time

app= Flask(__name__)


usuariosdb = [
        {"id":1, "nombre": "Mariani"},
        {"id":2, "nombre":"Carlos"},
        {"id":3, "nombre":"Luis"},
        {"id":4, "nombre":"Jose"},
        {"id":5, "nombre":"Maria"},
    ]

@app.route("/usuarios/<int:id>")
def usuario(id):
    for usuario in usuariosdb:
        if usuario["id"] == id:
            return jsonify(usuario), 200
    
    return jsonify({"error": "Usuario no encontrado"}), 404


@app.route("/usuarios")
def usuarios():
    return jsonify(usuariosdb), 200


@app.route("/health")
def health():
    return jsonify({
        "menssage": "todo bien"
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

