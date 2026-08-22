const { Schema, model } = require('mongoose');
const { CATEGORIAS } = require('../utils/categorias');

const fotografiaSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    lugar: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    categoria: { type: String, required: true, enum: CATEGORIAS },
    imagen_url: { type: String, required: true },
    imagen_public_id: { type: String, required: true },
    imagen_mimetype: { type: String, required: true },
    participante_id: { type: Schema.Types.ObjectId, ref: 'Participante', required: true, index: true },
  },
  { timestamps: true },
);

module.exports = model('Fotografia', fotografiaSchema);
