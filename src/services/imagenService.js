const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const cloudinaryClient = require('./cloudinaryClient');

const FORMATOS_PERMITIDOS = {
  jpeg: { formato: 'jpg', mimetype: 'image/jpeg' },
  png: { formato: 'png', mimetype: 'image/png' },
  webp: { formato: 'webp', mimetype: 'image/webp' },
};

class ImagenInvalidaError extends Error {}

// Decodifica el archivo con sharp para confirmar que es una imagen real
// (no confía en el mimetype/extension declarados por el cliente), la
// reescribe optimizada y la sube a Cloudinary con un nombre generado
// por el servidor.
async function validarYGuardarImagen(buffer) {
  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new ImagenInvalidaError('El archivo no es una imagen válida.');
  }

  const formato = FORMATOS_PERMITIDOS[metadata.format];
  if (!formato) {
    throw new ImagenInvalidaError('Formato de imagen no soportado. Usa JPG, PNG o WEBP.');
  }

  const pipeline = sharp(buffer).rotate();
  const optimizada =
    metadata.format === 'png'
      ? await pipeline.png({ compressionLevel: 8 }).toBuffer()
      : metadata.format === 'webp'
        ? await pipeline.webp({ quality: 85 }).toBuffer()
        : await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();

  const subida = await cloudinaryClient.subirBuffer(optimizada, {
    publicId: uuidv4(),
    formato: formato.formato,
  });

  return { url: subida.url, publicId: subida.publicId, mimetype: formato.mimetype };
}

async function eliminarImagen(publicId) {
  await cloudinaryClient.eliminarPorPublicId(publicId);
}

module.exports = { validarYGuardarImagen, eliminarImagen, ImagenInvalidaError };
