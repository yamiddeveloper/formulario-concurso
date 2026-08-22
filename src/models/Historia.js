const { Schema, model } = require('mongoose');

const historiaSchema = new Schema(
  {
    porque_tomo_la_foto: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    que_quiere_mostrar: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    significado_del_lugar: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    fotografia_id: { type: Schema.Types.ObjectId, ref: 'Fotografia', required: true, index: true },
  },
  { timestamps: true },
);

module.exports = model('Historia', historiaSchema);
