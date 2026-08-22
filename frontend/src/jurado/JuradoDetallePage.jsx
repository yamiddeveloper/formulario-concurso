import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";
import { obtenerFotografia, guardarCalificacion, eliminarCalificacion, JuradoApiError } from "./juradoApi";
import JuradoHeader from "./JuradoHeader";
import ImagenLightbox from "./ImagenLightbox";
import Button from "../components/Button";
import { RUBRICA, NIVELES, NOMBRES_NIVEL, PUNTAJE_MAXIMO } from "./rubrica";
import { CATEGORIAS } from "../lib/validation";

function nombreCategoria(valor) {
  return CATEGORIAS.find((c) => c.valor === valor)?.nombre || valor;
}

const PUNTUACIONES_VACIAS = { contenido: null, organizacion_estetica: null, creatividad: null, tecnica: null };

export default function JuradoDetallePage() {
  const { id } = useParams();
  const { token, cerrarSesion } = useJuradoAuth();
  const navigate = useNavigate();

  const [fotografia, setFotografia] = useState(null);
  const [puntuaciones, setPuntuaciones] = useState(PUNTUACIONES_VACIAS);
  const [error, setError] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [tieneCalificacion, setTieneCalificacion] = useState(false);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setFotografia(null);
    setError(null);
    setErrorCarga(null);
    setMensajeExito(null);

    obtenerFotografia(token, id)
      .then((res) => {
        if (cancelado) return;
        setFotografia(res.fotografia);
        setTieneCalificacion(Boolean(res.fotografia.mi_calificacion));
        setPuntuaciones(
          res.fotografia.mi_calificacion
            ? {
                contenido: res.fotografia.mi_calificacion.contenido,
                organizacion_estetica: res.fotografia.mi_calificacion.organizacion_estetica,
                creatividad: res.fotografia.mi_calificacion.creatividad,
                tecnica: res.fotografia.mi_calificacion.tecnica,
              }
            : PUNTUACIONES_VACIAS,
        );
      })
      .catch((err) => {
        if (cancelado) return;
        if (err instanceof JuradoApiError && err.status === 401) {
          cerrarSesion();
          navigate("/jurado/login", { replace: true });
          return;
        }
        setErrorCarga(err.message || "No fue posible cargar esta fotografía.");
      });

    return () => {
      cancelado = true;
    };
  }, [id, token, cerrarSesion, navigate]);

  const todasSeleccionadas = RUBRICA.every((c) => puntuaciones[c.clave] !== null);
  const total = todasSeleccionadas
    ? RUBRICA.reduce((suma, c) => suma + puntuaciones[c.clave], 0)
    : null;

  function seleccionar(clave, nivel) {
    setMensajeExito(null);
    setPuntuaciones((prev) => ({ ...prev, [clave]: nivel }));
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    setMensajeExito(null);
    try {
      await guardarCalificacion(token, id, puntuaciones);
      setTieneCalificacion(true);
      setMensajeExito("Calificación guardada correctamente.");
    } catch (err) {
      if (err instanceof JuradoApiError && err.status === 401) {
        cerrarSesion();
        navigate("/jurado/login", { replace: true });
        return;
      }
      setError(err.message || "No fue posible guardar la calificación.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    const confirmado = window.confirm(
      "¿Eliminar tu calificación para esta fotografía? Podrás volver a calificarla cuando quieras.",
    );
    if (!confirmado) return;

    setEliminando(true);
    setError(null);
    setMensajeExito(null);
    try {
      await eliminarCalificacion(token, id);
      setPuntuaciones(PUNTUACIONES_VACIAS);
      setTieneCalificacion(false);
      setMensajeExito("Calificación eliminada.");
    } catch (err) {
      if (err instanceof JuradoApiError && err.status === 401) {
        cerrarSesion();
        navigate("/jurado/login", { replace: true });
        return;
      }
      setError(err.message || "No fue posible eliminar la calificación.");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="app-shell">
      <JuradoHeader />
      <main className="app-main jurado-main jurado-detail-main">
        <Link to="/jurado" className="jurado-volver">
          ← Volver a la galería
        </Link>

        {errorCarga && (
          <p className="banner banner-error" role="alert">
            {errorCarga}
          </p>
        )}

        {fotografia && (
          <div className="jurado-detail">
            <button
              type="button"
              className="jurado-detail-image-wrap"
              onClick={() => setLightboxAbierto(true)}
              aria-label={`Ver "${fotografia.titulo}" en pantalla completa`}
            >
              <span className="jurado-detail-image-frame">
                <img src={fotografia.imagen_url} alt={fotografia.titulo} />
              </span>
            </button>

            {lightboxAbierto && (
              <ImagenLightbox
                src={fotografia.imagen_url}
                alt={fotografia.titulo}
                onClose={() => setLightboxAbierto(false)}
              />
            )}

            <div className="jurado-detail-body">
              <p className="step-context">
                {fotografia.lugar} · {nombreCategoria(fotografia.categoria)}
              </p>
              <h1 className="step-title">{fotografia.titulo}</h1>
              {fotografia.participante && (
                <p className="jurado-detail-participante">
                  {fotografia.participante.nombres} {fotografia.participante.apellidos}
                </p>
              )}

              {fotografia.historia && (
                <section className="jurado-historia">
                  <div className="jurado-historia-item">
                    <h2>¿Por qué tomó esta fotografía?</h2>
                    <p>{fotografia.historia.porque_tomo_la_foto}</p>
                  </div>
                  <div className="jurado-historia-item">
                    <h2>¿Qué quiere mostrarnos?</h2>
                    <p>{fotografia.historia.que_quiere_mostrar}</p>
                  </div>
                  <div className="jurado-historia-item">
                    <h2>¿Qué significa este lugar?</h2>
                    <p>{fotografia.historia.significado_del_lugar}</p>
                  </div>
                </section>
              )}

              <section className="jurado-evaluacion" aria-labelledby="evaluacion-titulo">
                <h2 id="evaluacion-titulo" className="jurado-evaluacion-titulo">
                  Evaluación
                </h2>
                <p className="step-description">
                  Basada en la rúbrica de CeDeC. Selecciona el nivel que mejor describe la fotografía en cada
                  categoría.
                </p>

                {RUBRICA.map((categoria) => (
                  <fieldset key={categoria.clave} className="jurado-rubrica-categoria">
                    <legend>{categoria.nombre}</legend>
                    <div className="jurado-rubrica-opciones">
                      {NIVELES.map((nivel) => {
                        const seleccionado = puntuaciones[categoria.clave] === nivel;
                        return (
                          <label
                            key={nivel}
                            className={`jurado-rubrica-opcion${seleccionado ? " is-selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name={categoria.clave}
                              value={nivel}
                              checked={seleccionado}
                              onChange={() => seleccionar(categoria.clave, nivel)}
                            />
                            <span className="jurado-rubrica-opcion-contenido">
                              <span className="jurado-rubrica-opcion-nivel">
                                {nivel} · {NOMBRES_NIVEL[nivel]}
                              </span>
                              <span className="jurado-rubrica-opcion-texto">{categoria.niveles[nivel]}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}

                <div className="jurado-total">
                  Puntaje total: <strong>{total ?? "—"}</strong> / {PUNTAJE_MAXIMO}
                </div>

                {mensajeExito && (
                  <p className="banner banner-success" role="status">
                    {mensajeExito}
                  </p>
                )}
                {error && (
                  <p className="banner banner-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="step-actions step-actions-end">
                  {tieneCalificacion && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={eliminar}
                      loading={eliminando}
                      disabled={guardando}
                    >
                      {eliminando ? "Eliminando..." : "Eliminar calificación"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="primary"
                    onClick={guardar}
                    loading={guardando}
                    disabled={!todasSeleccionadas || eliminando}
                  >
                    {guardando ? "Guardando..." : tieneCalificacion ? "Actualizar calificación" : "Guardar calificación"}
                  </Button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
