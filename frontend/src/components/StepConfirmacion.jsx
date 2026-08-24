import { useEffect, useState } from "react";
import { calcularEdad, CATEGORIAS } from "../lib/validation";

function Seccion({ titulo, paso, onEditar, children }) {
  return (
    <div className="summary-section">
      <div className="summary-section-header">
        <h2 className="summary-section-title">{titulo}</h2>
        <button type="button" className="button button-tertiary" onClick={() => onEditar(paso)}>
          Editar
        </button>
      </div>
      {children}
    </div>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="summary-item">
      <dt>{etiqueta}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

export default function StepConfirmacion({ datos, onEditar, errorGeneral }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!datos.imagen) return undefined;
    const url = URL.createObjectURL(datos.imagen);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [datos.imagen]);

  const edad = datos.fecha_nacimiento ? calcularEdad(new Date(datos.fecha_nacimiento)) : null;
  const categoria = CATEGORIAS.find((c) => c.valor === datos.categoria);

  return (
    <section aria-labelledby="paso-titulo">
      <header className="step-header">
        <p className="step-context">Último paso</p>
        <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
          Revisa tu participación
        </h1>
        <p className="step-description">Confirma que todo esté correcto antes de enviarla.</p>
      </header>

      {errorGeneral && (
        <p className="banner banner-error" role="alert">
          {errorGeneral}
        </p>
      )}

      <Seccion titulo="Participante" paso={1} onEditar={onEditar}>
        <dl className="summary-list">
          <Dato etiqueta="Nombre completo" valor={`${datos.nombres} ${datos.apellidos}`} />
          <Dato etiqueta="Teléfono" valor={datos.telefono} />
          <Dato etiqueta="Edad" valor={edad !== null ? `${edad} años` : "-"} />
          <Dato
            etiqueta="Estudiante"
            valor={datos.es_estudiante ? `Sí · ${datos.institucion}` : "No"}
          />
        </dl>
      </Seccion>

      <Seccion titulo="Fotografía" paso={2} onEditar={onEditar}>
        {previewUrl && (
          <img className="summary-image" src={previewUrl} alt="Vista previa de la fotografía a enviar" />
        )}
        <dl className="summary-list">
          <Dato etiqueta="Título" valor={datos.titulo} />
          <Dato etiqueta="Lugar" valor={datos.lugar} />
          <Dato etiqueta="Categoría" valor={categoria?.nombre || "-"} />
        </dl>
      </Seccion>

      <Seccion titulo="Historia" paso={3} onEditar={onEditar}>
        <dl className="summary-list summary-list-stacked">
          <Dato etiqueta="Por qué tomaste esta fotografía" valor={datos.porque_tomo_la_foto} />
          <Dato etiqueta="Qué quieres mostrarnos" valor={datos.que_quiere_mostrar} />
          <Dato etiqueta="Qué significa este lugar" valor={datos.significado_del_lugar} />
        </dl>
      </Seccion>
    </section>
  );
}
