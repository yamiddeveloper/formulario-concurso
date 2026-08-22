import { useEffect, useRef, useState } from "react";
import Field, { describedBy } from "./Field";
import { TAMANO_MAXIMO_MB, TIPOS_IMAGEN_PERMITIDOS, CATEGORIAS } from "../lib/validation";

function formatearTamano(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StepFotografia({ datos, errores, actualizarCampo, alPerderFoco }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);

  useEffect(() => {
    if (!datos.imagen) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(datos.imagen);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [datos.imagen]);

  function seleccionarArchivo(archivo) {
    if (!archivo) return;
    actualizarCampo("imagen", archivo);
    // La imagen no tiene evento de blur útil (es un input oculto activado
    // por botón): validamos apenas se elige, pasando el archivo directo
    // para no depender de que el estado ya se haya actualizado.
    alPerderFoco("imagen", archivo);
  }

  function alSoltar(e) {
    e.preventDefault();
    setArrastrando(false);
    seleccionarArchivo(e.dataTransfer.files?.[0]);
  }

  return (
    <section aria-labelledby="paso-titulo">
      <header className="step-header">
        <p className="step-context">Tu mirada de Chitagá</p>
        <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
          Sube tu fotografía
        </h1>
        <p className="step-description">Elige la imagen que quieres presentar al concurso.</p>
      </header>

      <div className="field">
        <span className="field-label" id="imagen-label">
          Fotografía
          <span className="field-required" aria-hidden="true">
            {" "}
            *
          </span>
        </span>
        <p className="field-hint" id="imagen-hint">
          Formatos JPG, PNG o WEBP · hasta {TAMANO_MAXIMO_MB}MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={TIPOS_IMAGEN_PERMITIDOS.join(",")}
          className="visually-hidden"
          onChange={(e) => seleccionarArchivo(e.target.files?.[0])}
          aria-labelledby="imagen-label"
          aria-describedby={describedBy("imagen", errores) || "imagen-hint"}
        />

        {!previewUrl && (
          <div
            className={`dropzone${arrastrando ? " dropzone-active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={alSoltar}
          >
            <p className="dropzone-title">Selecciona una imagen desde tu dispositivo</p>
            <p className="dropzone-subtitle">o arrástrala aquí</p>
            <button type="button" className="button button-secondary" onClick={() => inputRef.current?.click()}>
              Elegir archivo
            </button>
          </div>
        )}

        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Vista previa de la fotografía seleccionada" />
            <div className="image-preview-info">
              <span>{datos.imagen.name}</span>
              <span>{formatearTamano(datos.imagen.size)}</span>
            </div>
            <button type="button" className="button button-secondary" onClick={() => inputRef.current?.click()}>
              Reemplazar fotografía
            </button>
          </div>
        )}

        {errores.imagen && (
          <p className="field-error" id="imagen-error" role="alert">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8.25a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <span>{errores.imagen}</span>
          </p>
        )}
      </div>

      <Field label="Título de la fotografía" htmlFor="titulo" required error={errores.titulo}>
        <input
          id="titulo"
          className="input"
          type="text"
          placeholder="Un título que describa tu fotografía"
          value={datos.titulo}
          onChange={(e) => actualizarCampo("titulo", e.target.value)}
          onBlur={() => alPerderFoco("titulo")}
          aria-invalid={Boolean(errores.titulo)}
          aria-describedby={describedBy("titulo", errores)}
        />
      </Field>

      <Field label="Lugar donde la tomaste" htmlFor="lugar" required error={errores.lugar}>
        <input
          id="lugar"
          className="input"
          type="text"
          placeholder="Ej. Páramo de Chitagá"
          value={datos.lugar}
          onChange={(e) => actualizarCampo("lugar", e.target.value)}
          onBlur={() => alPerderFoco("lugar")}
          aria-invalid={Boolean(errores.lugar)}
          aria-describedby={describedBy("lugar", errores)}
        />
      </Field>

      <Field label="Categoría" htmlFor="categoria" required error={errores.categoria}>
        <div className="radio-group" id="categoria">
          {CATEGORIAS.map((c) => (
            <div className="radio-option" key={c.valor}>
              <input
                type="radio"
                id={`categoria_${c.valor}`}
                name="categoria"
                checked={datos.categoria === c.valor}
                onChange={() => actualizarCampo("categoria", c.valor)}
                onBlur={() => alPerderFoco("categoria")}
              />
              <label htmlFor={`categoria_${c.valor}`}>{c.nombre}</label>
            </div>
          ))}
        </div>
      </Field>
    </section>
  );
}
