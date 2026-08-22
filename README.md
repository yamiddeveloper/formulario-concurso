# Concurso de Fotografía Chitagá

Plataforma de inscripción y jurado para el concurso de fotografía **"Chitagá a través de mis ojos"**. Incluye:

- **Formulario público** de inscripción (participante, fotografía, historia) en 4 pasos.
- **Panel del jurado** protegido por login: galería, calificación con rúbrica, ranking de resultados por categoría.

## Stack

| Capa      | Tecnología                                                             |
| --------- | ------------------------------------------------------------------------ |
| Backend   | Node.js + Express + MongoDB (Mongoose) + Cloudinary (almacenamiento de imágenes) + JWT |
| Frontend  | React + Vite + React Router                                              |
| Tests     | `node:test` + Supertest + MongoDB Memory Server                          |

## Estructura del proyecto

```
.
├── server.js                  Punto de entrada del backend
├── src/
│   ├── app.js                 Configuración de Express (middlewares, rutas)
│   ├── config/db.js           Conexión a MongoDB
│   ├── models/                Participante, Fotografia, Historia, Jurado, Calificacion
│   ├── controllers/           Lógica de inscripción, autenticación y jurado
│   ├── routes/                /api/inscripciones y /api/jurado
│   ├── middleware/             Auth JWT, subida de archivos, ventana de inscripciones, errores
│   ├── services/               Cloudinary y procesamiento de imágenes (sharp)
│   ├── validators/             Reglas de validación (express-validator)
│   └── utils/                  Edad, categorías, ventana de inscripciones
├── scripts/crearJurado.js     Script de administración para crear cuentas de jurado
├── test/                      Tests de integración (API)
└── frontend/
    └── src/
        ├── pages/InscripcionPage.jsx   Formulario público (wizard)
        ├── components/                 Pasos del wizard y piezas reutilizables
        ├── jurado/                     Login, galería, detalle, resultados del jurado
        ├── hooks/, lib/                Estado del formulario, validación, API client
        └── styles/                     Tokens de diseño, estilos globales y del jurado
```

## Requisitos previos

Necesitas cuentas (gratuitas) en:

- **MongoDB Atlas** (o un MongoDB local) — base de datos.
- **Cloudinary** — almacenamiento de las fotografías subidas.

## Configuración

### Backend

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (por defecto 3000) |
| `MONGODB_URI` | Cadena de conexión a MongoDB |
| `MAX_UPLOAD_MB` | Tamaño máximo de imagen permitido |
| `CORS_ORIGIN` | Origen permitido para CORS (URL del frontend) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |
| `JWT_SECRET` | Secreto para firmar los tokens del jurado (usa una cadena aleatoria larga) |
| `JWT_EXPIRES_IN` | Duración de la sesión del jurado (ej. `12h`) |
| `INSCRIPCIONES_INICIO` / `INSCRIPCIONES_FIN` | Ventana de inscripciones, en formato ISO con offset de Colombia (`-05:00`) |

### Frontend

Dentro de `frontend/`, copia `.env.example` a `.env`:

```bash
cd frontend
cp .env.example .env
```

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | URL base de la API del backend (ej. `http://localhost:3000/api`) |

## Instalación y ejecución (desarrollo)

```bash
# Backend
npm install
npm run dev          # nodemon server.js — http://localhost:3000

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev           # http://localhost:5173
```

## Panel del jurado

No hay autoregistro. Las cuentas de jurado se crean por línea de comandos:

```bash
node scripts/crearJurado.js "Nombre del jurado" usuario contraseña
```

Luego el jurado inicia sesión en `/jurado/login`.

## Reglas de negocio principales

- Edad válida para participar: **14 a 28 años inclusive**.
- El formulario público solo acepta envíos dentro de la ventana definida por `INSCRIPCIONES_INICIO` / `INSCRIPCIONES_FIN` (verificado en el backend, no solo en el frontend).
- Cada fotografía pertenece a una de dos categorías: **Cultural o patrimonio** / **Natural**.
- Cada jurado califica una fotografía en 4 criterios (Contenido, Organización estética, Creatividad, Técnica) según la rúbrica de CeDeC, de 1 a 4 cada uno.
- Los resultados (ranking por categoría, 1er y 2do puesto) solo se muestran cuando **todos** los jurados activos han calificado **todas** las fotografías.
- Las imágenes se validan por su contenido real (no por la extensión declarada) antes de subirlas a Cloudinary.

Ver [AGENTS.md](AGENTS.md) para el detalle completo del modelo de datos y las convenciones de desarrollo del proyecto.

## Tests

```bash
npm test
```

Corre los tests de integración del backend (formulario público, autenticación del jurado, calificaciones y resultados) contra una base de datos MongoDB en memoria — no requiere Atlas ni Cloudinary reales.

Para el frontend:

```bash
cd frontend
npm run lint
```

## Notas de despliegue

- Las imágenes se guardan en Cloudinary, no en disco local — el backend puede desplegarse en plataformas con filesystem efímero (Render, Railway, etc.) sin perder fotos entre reinicios.
- `INSCRIPCIONES_INICIO`/`INSCRIPCIONES_FIN` deben incluir el offset `-05:00` explícito (Colombia no observa horario de verano) para que la fecha se interprete igual sin importar la zona horaria del servidor.
- Si usas `mongodb+srv://` y la conexión falla por timeout en la resolución DNS, revisa que la red donde corre el servidor pueda resolver registros DNS `TXT` (algunos routers domésticos los bloquean); cambiar el DNS a `8.8.8.8` suele resolverlo.
