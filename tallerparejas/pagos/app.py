from flask import Flask, jsonify

app = Flask (__name__)

@app.route('/pagos')
def pagos():
    return jsonify({'message': 'Bienvenido a la sección de pagos'})

@app.route('/health')
def health():
    return jsonify({
        'servicio': 'Pagos',
        'status': 'Servicio en línea'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
