from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/pedidos')
def pedidos():
    print("prueba", flush=True)
    return jsonify({'message': 'Bienvenido a la sección de pedidos'})

@app.route('/health')
def health():
    return jsonify({
        'servicio': 'Pedidos',
        'status': 'Servicio en línea'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)

    