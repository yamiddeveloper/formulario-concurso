const { Schema, model } = require('mongoose');

const juradoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 150 },
    usuario: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 100 },
    password_hash: { type: String, required: true, select: false },
    activo: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

module.exports = model('Jurado', juradoSchema);
