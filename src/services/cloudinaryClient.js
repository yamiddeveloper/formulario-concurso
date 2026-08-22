const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const CARPETA = 'concurso-fotografia-chitaga';

function subirBuffer(buffer, { publicId, formato }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CARPETA,
        public_id: publicId,
        format: formato,
        resource_type: 'image',
        overwrite: false,
      },
      (err, resultado) => {
        if (err) return reject(err);
        resolve({ url: resultado.secure_url, publicId: resultado.public_id });
      },
    );
    stream.end(buffer);
  });
}

async function eliminarPorPublicId(publicId) {
  await cloudinary.uploader.destroy(publicId).catch(() => {});
}

module.exports = { subirBuffer, eliminarPorPublicId };
