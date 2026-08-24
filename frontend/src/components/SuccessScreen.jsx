const ENLACE_GRUPO_WHATSAPP = "https://chat.whatsapp.com/Eyyje1zbwGNAPqsdcLnmZn";

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.35-.5.06-1.02.26-3.42-.72-2.9-1.19-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.1 1-2.39.26-.28.58-.35.77-.35h.55c.18 0 .42-.03.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.25.09 1.58.75 1.85.88.28.14.46.2.53.32.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

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

      <a
        className="button button-secondary success-whatsapp"
        href={ENLACE_GRUPO_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconoWhatsApp />
        Únete al grupo de WhatsApp
      </a>
    </section>
  );
}
