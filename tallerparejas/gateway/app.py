from flask import Flask, jsonify
from time import time
import requests


app = Flask(__name__)

errores = {
    'pedidos': 0,
    'inventario': 0,
    'pagos': 0
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


@app.route('/pedidos')
def pedidos():
    return jsonify(check_servicio("http://pedidos:5003/pedidos", "pedidos"))


@app.route('/inventario')
def inventario():
    return jsonify(check_servicio("http://inventario:5001/inventario", "inventario"))


@app.route('/pagos')
def pagos():
    return jsonify(check_servicio("http://pagos:5002/pagos", "pagos"))


@app.route('/monitor')
def monitor():
    servicios = {
        'pedidos': check_servicio("http://pedidos:5003/health", "pedidos"),
        'inventario': check_servicio("http://inventario:5001/health", "inventario"),
        'pagos': check_servicio("http://pagos:5002/health", "pagos")
    }
    return jsonify(servicios)

@app.route('/metricas')
def metricas():
    return jsonify({
        'errores': errores
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)