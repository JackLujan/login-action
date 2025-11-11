# Games Login Application

Aplicación de login para página de juegos desarrollada con Node.js, Express y TypeScript.

## 🚀 Características

- ✅ Sistema de autenticación con JWT
- ✅ API RESTful para login y gestión de juegos
- ✅ Pruebas unitarias y de integración
- ✅ Dockerizado y listo para producción
- ✅ Automatización de despliegue con GitHub Actions

## 📋 Requisitos

- Node.js 20+
- npm o yarn
- Docker (opcional)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 🐳 Docker

### Construir la imagen

```bash
docker build -t games-login-app .
```

### Ejecutar el contenedor

```bash
docker run -p 3000:3000 games-login-app
```

## 📡 API Endpoints

### Login

- `POST /api/login` - Autenticar usuario
- `GET /api/login/status` - Verificar estado de sesión

### Games (requiere autenticación)

- `GET /api/games` - Listar todos los juegos
- `GET /api/games/:id` - Obtener juego por ID

### Health Check

- `GET /health` - Estado del servidor

## 🔐 Credenciales de Prueba

- Usuario: `player1` / Contraseña: `password123`
- Usuario: `admin` / Contraseña: `admin123`

## 📝 Ejemplo de Uso

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","password":"password123"}'
```

### Obtener Juegos (con token)

```bash
curl -X GET http://localhost:3000/api/games \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🏗️ Estructura del Proyecto

```
app/
├── src/
│   ├── server.ts          # Servidor principal
│   ├── routes/            # Rutas de la API
│   │   ├── login.ts
│   │   └── games.ts
│   ├── services/         # Lógica de negocio
│   │   └── loginService.ts
│   └── __tests__/        # Pruebas
│       ├── login.test.ts
│       └── games.test.ts
├── dist/                 # Código compilado
├── Dockerfile
└── package.json
```

## 🔄 CI/CD

El proyecto está configurado con GitHub Actions para:
- Construcción automática de la imagen Docker
- Publicación automática a Docker Hub
- Ejecución de pruebas antes del despliegue

## 📊 Estado del Proyecto

Ver [ESTADO.md](./ESTADO.md) para detalles del estado actual del proyecto.

