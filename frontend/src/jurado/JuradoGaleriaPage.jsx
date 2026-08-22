import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";
import { listarFotografias, JuradoApiError } from "./juradoApi";
import JuradoHeader from "./JuradoHeader";
import { PUNTAJE_MAXIMO } from "./rubrica";
import { CATEGORIAS } from "../lib/validation";

function nombreCategoria(valor) {
  return CATEGORIAS.find((c) => c.valor === valor)?.nombre || valor;
}

const ORDENES = [
  { clave: "todos", etiqueta: "Todos" },
  { clave: "az", etiqueta: "A-Z" },
  { clave: "fecha", etiqueta: "Fecha" },
];

const FILTROS_CATEGORIA = [{ clave: "todas", etiqueta: "Todas las categorías" }, ...CATEGORIAS.map((c) => ({ clave: c.valor, etiqueta: c.nombre }))];

function ordenar(fotografias, orden) {
  const copia = [...fotografias];
  if (orden === "az") {
    return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  }
  if (orden === "fecha") {
    return copia.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
  }
  return copia;
}

export default function JuradoGaleriaPage() {
  const { token, cerrarSesion } = useJuradoAuth();
  const navigate = useNavigate();

  const [fotografias, setFotografias] = useState(null);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  useEffect(() => {
    let cancelado = false;

    listarFotografias(token)
      .then((res) => {
        if (!cancelado) setFotografias(res.fotografias);
      })
      .catch((err) => {
        if (cancelado) return;
        if (err instanceof JuradoApiError && err.status === 401) {
          cerrarSesion();
          navigate("/jurado/login", { replace: true });
          return;
        }
        setError(err.message || "No fue posible cargar la galería.");
      });

    return () => {
      cancelado = true;
    };
  }, [token, cerrarSesion, navigate]);

  const fotografiasFiltradas = useMemo(() => {
    if (!fotografias) return null;
    const filtradas =
      categoriaFiltro === "todas" ? fotografias : fotografias.filter((f) => f.categoria === categoriaFiltro);
    return ordenar(filtradas, orden);
  }, [fotografias, orden, categoriaFiltro]);

  return (
    <div className="app-shell">
      <JuradoHeader />
      <main className="app-main jurado-main jurado-gallery-main">
        <h1 className="visually-hidden">Galería de participaciones</h1>

        {!fotografias && <p className="jurado-empty">Cargando fotografías del concurso...</p>}

        {fotografias && fotografias.length > 0 && (
          <>
            <div className="jurado-tabs" role="tablist" aria-label="Filtrar por categoría">
              {FILTROS_CATEGORIA.map((c) => (
                <button
                  key={c.clave}
                  type="button"
                  role="tab"
                  aria-selected={categoriaFiltro === c.clave}
                  className={`jurado-tab${categoriaFiltro === c.clave ? " is-active" : ""}`}
                  onClick={() => setCategoriaFiltro(c.clave)}
                >
                  {c.etiqueta}
                </button>
              ))}
              <span className="jurado-contador">
                {fotografias.length} participante{fotografias.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="jurado-tabs jurado-tabs-secundarias" role="tablist" aria-label="Ordenar galería">
              {ORDENES.map((o) => (
                <button
                  key={o.clave}
                  type="button"
                  role="tab"
                  aria-selected={orden === o.clave}
                  className={`jurado-tab${orden === o.clave ? " is-active" : ""}`}
                  onClick={() => setOrden(o.clave)}
                >
                  {o.etiqueta}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p className="banner banner-error" role="alert">
            {error}
          </p>
        )}

        {fotografias && fotografias.length === 0 && (
          <p className="jurado-empty">Todavía no hay fotografías registradas.</p>
        )}

        {fotografiasFiltradas && fotografiasFiltradas.length === 0 && fotografias.length > 0 && (
          <p className="jurado-empty">No hay fotografías en esta categoría.</p>
        )}

        {fotografiasFiltradas && fotografiasFiltradas.length > 0 && (
          <ul className="jurado-grid">
            {fotografiasFiltradas.map((foto) => (
              <li key={foto.id}>
                <Link to={`/jurado/fotografias/${foto.id}`} className="jurado-card">
                  <img src={foto.imagen_url} alt="" loading="lazy" />
                  <span className="jurado-card-categoria">{nombreCategoria(foto.categoria)}</span>
                  {foto.mi_calificacion && (
                    <span className="jurado-card-badge">
                      {foto.mi_calificacion.total}/{PUNTAJE_MAXIMO}
                    </span>
                  )}
                  <span className="jurado-card-overlay">
                    <span className="jurado-card-titulo">{foto.titulo}</span>
                    <span className="jurado-card-participante">
                      {foto.participante ? `${foto.participante.nombres} ${foto.participante.apellidos}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
