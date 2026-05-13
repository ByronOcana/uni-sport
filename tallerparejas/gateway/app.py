from flask import Flask, jsonify
from time import time
import requests


app = Flask(__name__)

@app.route('/pedidos')
def pedidos():
    response = requests.get('http://pedidos:5003/pedidos')
    return jsonify(response.json())

@app.route('/inventario')
def inventario():
    response = requests.get('http://inventario:5001/inventario')
    return jsonify(response.json())

@app.route('/pagos')
def pagos():
    tiempo_inicio = time()
    respuesta = None

    try:
        print("[PAGOS]: Se inicio la peticion de servicio interno de pagos", flush=True)
        response = requests.get('http://pagos:5002/pagos', timeout=2)    
        print("[PAGOS]: El servicio respondio a la peticion", flush=True)
        respuesta = response.json()

    except requests.exceptions.Timeout:
        print("[PAGOS: ERROR]: El servicio demora mucho en responder", flush=True)
        respuesta = {"error": "El servicio esta demorando mucho"}

    except requests.exceptions.ConnectionError:
        print("[PAGOS: ERROR]: No se a podido hacer una conexcion con el serivicio", flush=True)
        respuesta ={"error": "El no esta disponible"}

    finally:
        tiempo_final = time()
        print(f"[PAGOS] El servicio se ha demorando {tiempo_final - tiempo_inicio}seg", flush=True)

    return jsonify(respuesta)

@app.route('/monitor')
def monitor():
    servicios = {
        'pedidos': requests.get('http://pedidos:5003/health').json(),
        'inventario': requests.get('http://inventario:5001/health').json(),
        'pagos': requests.get('http://pagos:5002/health').json()
    }
    return jsonify(servicios)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)