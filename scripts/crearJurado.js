// Script de administracion: crea o actualiza la contraseña de un jurado.
// Uso: node scripts/crearJurado.js "Nombre Apellido" usuario contraseña
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../src/config/db');
const Jurado = require('../src/models/Jurado');

async function main() {
  const [, , nombre, usuario, password] = process.argv;

  if (!nombre || !usuario || !password) {
    console.error('Uso: node scripts/crearJurado.js "Nombre Apellido" usuario contraseña');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  await connectDB(process.env.MONGODB_URI);

  const password_hash = await bcrypt.hash(password, 12);
  const usuarioNormalizado = usuario.trim().toLowerCase();

  const jurado = await Jurado.findOneAndUpdate(
    { usuario: usuarioNormalizado },
    { nombre: nombre.trim(), usuario: usuarioNormalizado, password_hash, activo: true },
    { upsert: true, new: true },
  );

  console.log(`Jurado listo: ${jurado.nombre} (usuario: ${jurado.usuario})`);
  process.exit(0);
}

main().catch((err) => {
  console.error('No fue posible crear el jurado:', err.message);
  process.exit(1);
});
