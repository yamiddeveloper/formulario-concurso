import { useEffect, useState } from "react";

// El backend gratuito de Render se suspende tras un rato sin trafico y puede
// tardar cerca de un minuto en responder la primera peticion. Sin este aviso
// el usuario solo veria una tarjeta vacia y pensaria que la pagina fallo.
const MS_ANTES_DE_AVISAR = 4000;

export default function EstadoCargando() {
  const [tardando, setTardando] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setTardando(true), MS_ANTES_DE_AVISAR);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <section className="ventana-estado" aria-busy="true">
      <div className="ventana-icono-wrap">
        <span className="ventana-icono-anillo" aria-hidden="true" />
        <span className="ventana-icono">
          <span className="spinner spinner-grande" aria-hidden="true" />
        </span>
      </div>

      <p className="ventana-titulo" role="status">
        Cargando el concurso
      </p>

      <p className="ventana-texto">
        {tardando
          ? "Esto puede tardar hasta un minuto la primera vez. Gracias por la paciencia."
          : "Un momento, por favor."}
      </p>
    </section>
  );
}
