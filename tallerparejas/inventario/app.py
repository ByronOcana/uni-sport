from flask import Flask, jsonify
app = Flask(__name__)

lista = ["reloj", "ducha", "silla", "mesa", "lámpara"]

@app.route('/inventario')
def inventario():
    global lista
    return jsonify({'message': 'Bienvenido a la sección de inventario', 'inventario': lista})

@app.route('/health')
def health():
    return jsonify({
        'servicio': 'Inventario',
        'status': 'Servicio en línea'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)