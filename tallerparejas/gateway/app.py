from flask import Flask, jsonify
from time import time
import requests


app = Flask(__name__)


def check_servicio(url_servicio):
    tiempo_inicio = time()
    respuesta = None

    try:
        print("[PAGOS]: Se inicio la peticion de servicio interno de pagos", flush=True)
        response = requests.get(url_servicio, timeout=2)    
        print("[PAGOS]: El servicio respondio a la peticion", flush=True)
        respuesta = response.json()

    except requests.exceptions.Timeout:
        print("[PAGOS: ERROR]: El servicio demora mucho en responder", flush=True)
        respuesta = {"error": "El servicio esta demorando mucho"}

    except requests.exceptions.ConnectionError:
        print("[PAGOS: ERROR]: No se a podido hacer una conexcion con el serivicio", flush=True)
        respuesta = {"error": "El no esta disponible"}

    finally:
        tiempo_final = time()
        print(f"[PAGOS] El servicio se ha demorando {tiempo_final - tiempo_inicio}seg \n\n", flush=True)

    return jsonify(respuesta)


@app.route('/pedidos')
def pedidos():
    return check_servicio("http://pedidos:5003/pedidos")


@app.route('/inventario')
def inventario():
    return check_servicio("http://inventario:5001/inventario")


@app.route('/pagos')
def pagos():
    return check_servicio("http://pagos:5002/pagos")


@app.route('/monitor')
def monitor():
    servicios = {
        'pedidos': check_servicio("http://pedidos:5003/health"),
        'inventario': check_servicio("http://inventario:5001/health"),
        'pagos': check_servicio("http://pagos:5002/health")
    }
    return jsonify(servicios)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)