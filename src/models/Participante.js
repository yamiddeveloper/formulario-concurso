const { Schema, model } = require('mongoose');

const participanteSchema = new Schema(
  {
    nombres: { type: String, required: true, trim: true, maxlength: 100 },
    apellidos: { type: String, required: true, trim: true, maxlength: 100 },
    telefono: { type: String, required: true, trim: true, maxlength: 20 },
    // Solo digitos, para poder detectar que "300 111-2222" y "3001112222"
    // son el mismo numero e impedir que la misma persona participe dos
    // veces. `sparse` evita que las inscripciones creadas antes de este
    // campo (que no lo tienen) cuenten como un duplicado entre si.
    telefono_normalizado: { type: String, required: true, unique: true, sparse: true },
    fecha_nacimiento: { type: Date, required: true },
    es_estudiante: { type: Boolean, required: true, default: false },
    institucion: {
      type: String,
      trim: true,
      maxlength: 150,
      required: [
        function institucionRequerida() {
          return this.es_estudiante === true;
        },
        'institución es obligatoria cuando es_estudiante es true',
      ],
    },
  },
  { timestamps: true },
);

module.exports = model('Participante', participanteSchema);
