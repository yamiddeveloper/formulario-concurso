import { useState } from "react";
import Field, { describedBy } from "./Field";
import { EDAD_MINIMA, EDAD_MAXIMA } from "../lib/validation";

const MESES = [
  { valor: "01", nombre: "Enero" },
  { valor: "02", nombre: "Febrero" },
  { valor: "03", nombre: "Marzo" },
  { valor: "04", nombre: "Abril" },
  { valor: "05", nombre: "Mayo" },
  { valor: "06", nombre: "Junio" },
  { valor: "07", nombre: "Julio" },
  { valor: "08", nombre: "Agosto" },
  { valor: "09", nombre: "Septiembre" },
  { valor: "10", nombre: "Octubre" },
  { valor: "11", nombre: "Noviembre" },
  { valor: "12", nombre: "Diciembre" },
];

const ANIO_ACTUAL = new Date().getFullYear();
// Un ano extra de margen en cada punta: la validez exacta (14-28 anos
// inclusive) la revisa el validador; este rango solo evita una lista
// interminable de anos que nunca podrian ser validos.
const ANIO_MAS_RECIENTE = ANIO_ACTUAL - EDAD_MINIMA;
const ANIO_MAS_ANTIGUO = ANIO_ACTUAL - EDAD_MAXIMA - 1;
const ANIOS = Array.from(
  { length: ANIO_MAS_RECIENTE - ANIO_MAS_ANTIGUO + 1 },
  (_, i) => ANIO_MAS_RECIENTE - i,
);

function diasEnMes(mes, anio) {
  if (!mes) return 31;
  // Sin anio todavia elegido, usamos un anio bisiesto para no bloquear el
  // 29 de febrero antes de tiempo.
  const anioReferencia = anio ? Number(anio) : 2024;
  return new Date(anioReferencia, Number(mes), 0).getDate();
}

function parsearFecha(iso) {
  if (!iso) return { dia: "", mes: "", anio: "" };
  const [anio, mes, dia] = iso.split("-");
  return { dia: dia || "", mes: mes || "", anio: anio || "" };
}

function combinarFecha(dia, mes, anio) {
  if (!dia || !mes || !anio) return "";
  return `${anio}-${mes}-${dia.padStart(2, "0")}`;
}

export default function StepParticipante({ datos, errores, actualizarCampo, alPerderFoco }) {
  const inicial = parsearFecha(datos.fecha_nacimiento);
  const [dia, setDia] = useState(inicial.dia);
  const [mes, setMes] = useState(inicial.mes);
  const [anio, setAnio] = useState(inicial.anio);

  const maxDias = diasEnMes(mes, anio);
  const dias = Array.from({ length: maxDias }, (_, i) => String(i + 1).padStart(2, "0"));

  function alCambiarFecha(siguienteDia, siguienteMes, siguienteAnio) {
    setDia(siguienteDia);
    setMes(siguienteMes);
    setAnio(siguienteAnio);
    actualizarCampo("fecha_nacimiento", combinarFecha(siguienteDia, siguienteMes, siguienteAnio));
  }

  function alCambiarDia(valor) {
    alCambiarFecha(valor, mes, anio);
  }

  function alCambiarMes(valor) {
    const maxNuevo = diasEnMes(valor, anio);
    const diaAjustado = dia && Number(dia) > maxNuevo ? "" : dia;
    alCambiarFecha(diaAjustado, valor, anio);
  }

  function alCambiarAnio(valor) {
    const maxNuevo = diasEnMes(mes, valor);
    const diaAjustado = dia && Number(dia) > maxNuevo ? "" : dia;
    alCambiarFecha(diaAjustado, mes, valor);
  }

  return (
    <section aria-labelledby="paso-titulo">
      <header className="step-header">
        <p className="step-context">Antes de empezar</p>
        <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
          Cuéntanos quién eres
        </h1>
        <p className="step-description">
          Estos datos nos permiten verificar que cumples los requisitos del concurso.
        </p>
      </header>

      <Field label="Nombres" htmlFor="nombres" required error={errores.nombres}>
        <input
          id="nombres"
          className="input"
          type="text"
          autoComplete="given-name"
          value={datos.nombres}
          onChange={(e) => actualizarCampo("nombres", e.target.value)}
          onBlur={() => alPerderFoco("nombres")}
          aria-invalid={Boolean(errores.nombres)}
          aria-describedby={describedBy("nombres", errores)}
        />
      </Field>

      <Field label="Apellidos" htmlFor="apellidos" required error={errores.apellidos}>
        <input
          id="apellidos"
          className="input"
          type="text"
          autoComplete="family-name"
          value={datos.apellidos}
          onChange={(e) => actualizarCampo("apellidos", e.target.value)}
          onBlur={() => alPerderFoco("apellidos")}
          aria-invalid={Boolean(errores.apellidos)}
          aria-describedby={describedBy("apellidos", errores)}
        />
      </Field>

      <div className="field">
        <span className="field-label" id="fecha_nacimiento-label">
          Fecha de nacimiento
          <span className="field-required" aria-hidden="true">
            {" "}
            *
          </span>
        </span>
        <p className="field-hint" id="fecha_nacimiento-hint">
          Debes tener entre {EDAD_MINIMA} y {EDAD_MAXIMA} años para participar.
        </p>

        <div
          className="date-select-group"
          role="group"
          aria-labelledby="fecha_nacimiento-label"
          aria-describedby={describedBy("fecha_nacimiento", errores) || "fecha_nacimiento-hint"}
        >
          <select
            className="input date-select date-select-dia"
            aria-label="Día"
            value={dia}
            onChange={(e) => alCambiarDia(e.target.value)}
            onBlur={() => alPerderFoco("fecha_nacimiento")}
            aria-invalid={Boolean(errores.fecha_nacimiento)}
          >
            <option value="">Día</option>
            {dias.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            className="input date-select date-select-mes"
            aria-label="Mes"
            value={mes}
            onChange={(e) => alCambiarMes(e.target.value)}
            onBlur={() => alPerderFoco("fecha_nacimiento")}
            aria-invalid={Boolean(errores.fecha_nacimiento)}
          >
            <option value="">Mes</option>
            {MESES.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.nombre}
              </option>
            ))}
          </select>

          <select
            className="input date-select date-select-anio"
            aria-label="Año"
            value={anio}
            onChange={(e) => alCambiarAnio(e.target.value)}
            onBlur={() => alPerderFoco("fecha_nacimiento")}
            aria-invalid={Boolean(errores.fecha_nacimiento)}
          >
            <option value="">Año</option>
            {ANIOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {errores.fecha_nacimiento && (
          <p className="field-error" id="fecha_nacimiento-error" role="alert">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8.25a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <span>{errores.fecha_nacimiento}</span>
          </p>
        )}
      </div>

      <Field label="¿Eres estudiante?" htmlFor="es_estudiante" required error={errores.es_estudiante}>
        <div className="radio-group" id="es_estudiante">
          <div className="radio-option">
            <input
              type="radio"
              id="es_estudiante_si"
              name="es_estudiante"
              checked={datos.es_estudiante === true}
              onChange={() => actualizarCampo("es_estudiante", true)}
              onBlur={() => alPerderFoco("es_estudiante")}
            />
            <label htmlFor="es_estudiante_si">Sí</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="es_estudiante_no"
              name="es_estudiante"
              checked={datos.es_estudiante === false}
              onChange={() => actualizarCampo("es_estudiante", false)}
              onBlur={() => alPerderFoco("es_estudiante")}
            />
            <label htmlFor="es_estudiante_no">No</label>
          </div>
        </div>
      </Field>

      {datos.es_estudiante === true && (
        <Field label="Institución" htmlFor="institucion" required error={errores.institucion}>
          <input
            id="institucion"
            className="input"
            type="text"
            placeholder="Nombre de tu colegio o universidad"
            value={datos.institucion}
            onChange={(e) => actualizarCampo("institucion", e.target.value)}
            onBlur={() => alPerderFoco("institucion")}
            aria-invalid={Boolean(errores.institucion)}
            aria-describedby={describedBy("institucion", errores)}
          />
        </Field>
      )}
    </section>
  );
}
