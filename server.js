require('dotenv').config();
const { crearApp } = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta la variable de entorno MONGODB_URI.');
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
