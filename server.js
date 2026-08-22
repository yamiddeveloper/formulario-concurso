require('dotenv').config();
const { crearApp } = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Sin estas variables el servidor arranca pero falla mas tarde, en medio de
// una peticion real y con un error generico. Es preferible no arrancar y
// decir exactamente que falta.
const VARIABLES_REQUERIDAS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

async function iniciar() {
  const faltantes = VARIABLES_REQUERIDAS.filter((nombre) => !process.env[nombre]);
  if (faltantes.length > 0) {
    throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}.`);
  }

  await connectDB(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB.');

  const app = crearApp();
  app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}.`);
  });
}

iniciar().catch((err) => {
  console.error('No fue posible iniciar el servidor:', err.message);
  process.exit(1);
});
