import { formatearFechaColombia } from "../lib/formatoFecha";

export default function VentanaInscripcionCerrada({ motivo, inicio, fin }) {
  const esAntes = motivo === "no_iniciada";

  return (
    <section aria-labelledby="paso-titulo">
      <header className="step-header">
        <p className="step-context">{esAntes ? "Todavía no empieza" : "Inscripciones cerradas"}</p>
        <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
          {esAntes ? "El concurso abre pronto" : "Ya no se reciben nuevas participaciones"}
        </h1>
        <p className="step-description">
          {esAntes
            ? `Las inscripciones abren el ${formatearFechaColombia(inicio)}.`
            : `Las inscripciones cerraron el ${formatearFechaColombia(fin)}.`}
        </p>
      </header>

      <p className="step-description">
        {esAntes
          ? "Vuelve a esta página cuando abra el plazo para subir tu fotografía y tu historia."
          : "Gracias a todas las personas que participaron mostrándonos a Chitagá a través de sus ojos."}
      </p>
    </section>
  );
}
