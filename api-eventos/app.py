from flask import Flask, jsonify

app = Flask(__name__)

eventos = [
    {
        "id": 1,
        "nombre": "Copa Universitaria",
        "deporte": "Fútbol",
        "equipos": ["Unicauca", "UniValle"],
        "fecha": "2026-06-15",
        "lugar": "Coliseo la estancia Popayán"
    },
    {
        "id": 2,
        "nombre": "Torneo Interuniversitario de Baloncesto",
        "deporte": "Baloncesto",
        "equipos": ["Unicomfacauca", "Colegio mayor"],
        "fecha": "2026-06-16",
        "lugar": "Gimnasio Universitario del cauca"
    },
    {
        "id": 3,
        "nombre": "Campeonato Universitario de Atletismo",
        "deporte": "Atletismo",
        "equipos": ["Unicauca", "UniValle", "Unicomfacauca", "Colegio mayor"],
        "fecha": "2026-06-17",
        "lugar": "Pista de atletismo de la universidad del cauca"
    },
    {
        "id": 4,
        "nombre": "Torneo Universitario de Voleibol",
        "deporte": "Voleibol",
        "equipos": ["Unicauca", "Unicomfacauca"],
        "fecha": "2026-06-20",
        "lugar": "Coliseo la estancia Popayán"
    },
    {
        "id": 5,
        "nombre": "Copa Interuniversitaria de Natación",
        "deporte": "Natación",
        "equipos": ["UniValle", "Colegio mayor", "Unicauca"],
        "fecha": "2026-06-22",
        "lugar": "Complejo deportivo la villa"
    },
    {
        "id": 6,
        "nombre": "Campeonato de Ajedrez Universitario",
        "deporte": "Ajedrez",
        "equipos": ["Unicomfacauca", "UniValle", "Unicauca", "Colegio mayor"],
        "fecha": "2026-06-25",
        "lugar": "Auditorio Universidad del Cauca"
    }
]

@app.route("/eventos")
def get_eventos():
    return jsonify({"eventos": eventos})

@app.route("/health")
def health_check():
    return jsonify({
        "Servicio": "Eventos",
        "status": "OK"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)