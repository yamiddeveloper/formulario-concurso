import { formatearFechaColombia } from "../lib/formatoFecha";

function IconoReloj() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l3.2 1.8" strokeLinecap="round" />
      <path className="ventana-icono-manecilla" d="M12 12V7" strokeLinecap="round" />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path className="ventana-icono-check" d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VentanaInscripcionCerrada({ motivo, inicio, fin }) {
  const esAntes = motivo === "no_iniciada";

  return (
    <section className="ventana-estado" aria-labelledby="paso-titulo">
      <div className="ventana-icono-wrap">
        <span className="ventana-icono-anillo" aria-hidden="true" />
        <span className="ventana-icono">{esAntes ? <IconoReloj /> : <IconoCheck />}</span>
      </div>

      <p className="step-context">{esAntes ? "Todavía no empieza" : "Inscripciones cerradas"}</p>
      <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
        {esAntes ? "El concurso abre pronto" : "Ya no se reciben nuevas participaciones"}
      </h1>
      <p className="step-description">
        {esAntes
          ? `Las inscripciones abren el ${formatearFechaColombia(inicio)}.`
          : `Las inscripciones cerraron el ${formatearFechaColombia(fin)}.`}
      </p>
      <p className="step-description">
        {esAntes
          ? "Vuelve a esta página cuando abra el plazo para subir tu fotografía y tu historia."
          : "Gracias a todas las personas que participaron mostrándonos a Chitagá a través de sus ojos."}
      </p>
    </section>
  );
}
