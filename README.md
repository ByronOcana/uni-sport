# 🏆 UniSport
> Casa de apuestas deportivas con enfoque en torneos universitarios

---

## 📋 Requisitos previos

Antes de correr el proyecto asegúrate de tener instalado:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) — solo para el frontend

---

## 🚀 Cómo correr el proyecto

### 1. Clona el repositorio
```bash
git clone https://github.com/iNothingAtAll/uni-sport.git
cd UniSport
```

### 2. Configura las variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
MYSQL_DATABASE=db
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_ROOT_PASSWORD=root
PMA_HOST=db
PMA_PORT=3306
```

### 3. Levanta los servicios con Docker
```bash
docker-compose up --build
```

### 4. Corre el frontend
```bash
cd Front
npm install
npm start
```

---

## 🌐 Servicios disponibles

| Servicio | URL |
|---|---|
| **Gateway** (API principal) | http://localhost:5000 |
| **phpMyAdmin** (BD) | http://localhost:8080 |
| **Frontend** | http://localhost:3000 |

---

## 📁 Estructura del proyecto

```
UniSport/
├── gateway/            # API Gateway — punto de entrada
├── api-usuarios/       # Servicio de usuarios y autenticación
├── api-transacciones/  # Servicio de transacciones y apuestas
├── api-modules/        # Servicio de módulos adicionales
├── db/                 # Scripts de inicialización de la BD
├── Front/              # Frontend (requiere Node.js)
├── .env                # Variables de entorno (no subir a GitHub)
├── .gitignore
└── Compose.yaml
```

---

## 📌 Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Info general de los servicios |
| GET | `/usuarios` | Lista todos los usuarios |
| GET | `/usuario/<id>` | Obtiene un usuario por ID |
| POST | `/usuario/auth` | Autenticación de usuario |
| POST | `/registro` | Registro de nuevo usuario |
| GET | `/transacciones` | Lista todas las transacciones |
| GET | `/transaccion/<id>` | Obtiene una transacción por ID |
| GET | `/transacciones/usuario/<id>` | Transacciones de un usuario |


