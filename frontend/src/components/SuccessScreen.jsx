export default function SuccessScreen({ resultado }) {
  return (
    <section className="success-screen" aria-labelledby="exito-titulo">
      <div className="success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 id="exito-titulo" className="success-title">
        Participación registrada
      </h1>
      <p className="success-message">Recibimos tu fotografía y tu historia correctamente.</p>

      {resultado?.imagen_url && (
        <img className="success-image" src={resultado.imagen_url} alt={`Fotografía enviada: ${resultado.titulo}`} />
      )}

      <p className="success-note">
        Gracias por mostrarnos a Chitagá a través de tus ojos. Muy pronto conocerás los resultados del concurso.
      </p>
    </section>
  );
}
