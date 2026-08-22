import { partirFechaColombia } from "../lib/formatoFecha";

function IconoReloj() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l3.2 1.8" strokeLinecap="round" />
      <path className="ventana-icono-manecilla" d="M12 12V7" strokeLinecap="round" />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path className="ventana-icono-check" d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCalendario() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

export default function VentanaInscripcionCerrada({ motivo, inicio, fin }) {
  const esAntes = motivo === "no_iniciada";
  const { fecha, hora } = partirFechaColombia(esAntes ? inicio : fin);

  return (
    <section className="ventana-estado" aria-labelledby="paso-titulo">
      <div className="ventana-icono-wrap">
        <span className="ventana-icono-anillo" aria-hidden="true" />
        <span className="ventana-icono">{esAntes ? <IconoReloj /> : <IconoCheck />}</span>
      </div>

      <p className="step-context">{esAntes ? "Todavía no empieza" : "Inscripciones cerradas"}</p>

      <h1 className="ventana-titulo" id="paso-titulo" tabIndex={-1}>
        {esAntes ? "El concurso abre pronto" : "Ya no se reciben nuevas participaciones"}
      </h1>

      <p className="ventana-texto">
        {esAntes
          ? "Vuelve a esta página cuando abra el plazo para subir tu fotografía y tu historia."
          : "Gracias a todas las personas que participaron mostrándonos a Chitagá a través de sus ojos."}
      </p>

      <div className="ventana-fecha">
        <p className="ventana-fecha-label">
          <IconoCalendario />
          <span>{esAntes ? "Las inscripciones abren" : "Las inscripciones cerraron"}</span>
        </p>
        <p className="ventana-fecha-valor">{fecha}</p>
        <p className="ventana-fecha-hora">
          {hora} <span aria-hidden="true">·</span> hora de Colombia
        </p>
      </div>
    </section>
  );
}
