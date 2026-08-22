const multer = require('multer');

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 10;

const ALLOWED_MIMETYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'imagen'));
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

module.exports = { upload, MAX_UPLOAD_MB, ALLOWED_MIMETYPES };
