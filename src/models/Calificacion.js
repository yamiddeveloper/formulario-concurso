const { Schema, model } = require('mongoose');

const calificacionSchema = new Schema(
  {
    jurado_id: { type: Schema.Types.ObjectId, ref: 'Jurado', required: true, index: true },
    fotografia_id: { type: Schema.Types.ObjectId, ref: 'Fotografia', required: true, index: true },
    contenido: { type: Number, required: true, min: 1, max: 4 },
    organizacion_estetica: { type: Number, required: true, min: 1, max: 4 },
    creatividad: { type: Number, required: true, min: 1, max: 4 },
    tecnica: { type: Number, required: true, min: 1, max: 4 },
  },
  { timestamps: true },
);

// Un jurado tiene a lo sumo una calificacion por fotografia; volver a
// calificar actualiza la existente en vez de crear una nueva.
calificacionSchema.index({ jurado_id: 1, fotografia_id: 1 }, { unique: true });

module.exports = model('Calificacion', calificacionSchema);
