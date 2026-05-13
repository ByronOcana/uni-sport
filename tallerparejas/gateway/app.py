from flask import Flask, jsonify
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
    response = requests.get('http://pagos:5002/pagos')
    return jsonify(response.json())

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