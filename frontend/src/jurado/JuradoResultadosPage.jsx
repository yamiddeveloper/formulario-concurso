import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";
import { obtenerResultados, JuradoApiError } from "./juradoApi";
import JuradoHeader from "./JuradoHeader";

function TablaCategoria({ categoria, juradosTotales }) {
  return (
    <section className="jurado-resultados-categoria">
      <div className="jurado-resultados-categoria-header">
        <h2>{categoria.nombre}</h2>
      </div>

      {categoria.resultados.length === 0 ? (
        <p className="jurado-empty">Todavía no hay fotografías en esta categoría.</p>
      ) : (
        <ol className="jurado-resultados-lista">
          {categoria.resultados.map((r) => (
            <li key={r.id} className={`jurado-resultado-fila${r.es_ganador ? " es-podio" : ""}`}>
              <span className="jurado-resultado-posicion">{r.posicion}</span>
              <img className="jurado-resultado-imagen" src={r.imagen_url} alt="" />
              <span className="jurado-resultado-info">
                <span className="jurado-resultado-titulo">{r.titulo}</span>
                <span className="jurado-resultado-participante">
                  {r.participante ? `${r.participante.nombres} ${r.participante.apellidos}` : ""}
                </span>
              </span>
              <span className="jurado-resultado-puntaje">
                <strong>{r.puntaje_total}</strong>
                <span className="jurado-resultado-conteo">
                  {r.calificaciones_recibidas}/{juradosTotales} jurados
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function EnEspera({ totalFotografias, fotografiasCompletas, juradosTotales }) {
  return (
    <div className="jurado-resultados-espera">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2>Resultados aún no disponibles</h2>
      <p>
        Se publican cuando {juradosTotales === 1 ? "el" : "los"} {juradosTotales} jurado
        {juradosTotales === 1 ? "" : "s"} haya{juradosTotales === 1 ? "" : "n"} calificado todas las fotografías,
        para que ningún puntaje parcial influya en la evaluación.
      </p>
      <p className="jurado-resultados-progreso">
        {fotografiasCompletas} de {totalFotografias} fotografía{totalFotografias === 1 ? "" : "s"} calificada
        {totalFotografias === 1 ? "" : "s"} por completo.
      </p>
    </div>
  );
}

export default function JuradoResultadosPage() {
  const { token, cerrarSesion } = useJuradoAuth();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    obtenerResultados(token)
      .then((res) => {
        if (!cancelado) setDatos(res);
      })
      .catch((err) => {
        if (cancelado) return;
        if (err instanceof JuradoApiError && err.status === 401) {
          cerrarSesion();
          navigate("/jurado/login", { replace: true });
          return;
        }
        setError(err.message || "No fue posible cargar los resultados.");
      });

    return () => {
      cancelado = true;
    };
  }, [token, cerrarSesion, navigate]);

  const totalFotografias = datos ? datos.categorias.reduce((n, c) => n + c.resultados.length, 0) : 0;
  const fotografiasCompletas = datos
    ? datos.categorias.reduce((n, c) => n + c.resultados.filter((r) => r.completa).length, 0)
    : 0;

  return (
    <div className="app-shell">
      <JuradoHeader />
      <main className="app-main jurado-main">
        <div className="jurado-gallery-intro">
          <h1 className="step-title">Resultados</h1>
          <p className="step-description">
            {datos
              ? "Primer y segundo puesto ganan en cada categoría."
              : "Calculando resultados..."}
          </p>
        </div>

        {error && (
          <p className="banner banner-error" role="alert">
            {error}
          </p>
        )}

        {datos && totalFotografias === 0 && (
          <p className="jurado-empty">Todavía no hay fotografías para evaluar.</p>
        )}

        {datos && totalFotografias > 0 && !datos.evaluacion_completa && (
          <EnEspera
            totalFotografias={totalFotografias}
            fotografiasCompletas={fotografiasCompletas}
            juradosTotales={datos.jurados_totales}
          />
        )}

        {datos && totalFotografias > 0 && datos.evaluacion_completa && (
          <>
            <p className="banner banner-success" role="status">
              Evaluación completa: {datos.jurados_totales === 1 ? "el" : "los"} {datos.jurados_totales} jurado
              {datos.jurados_totales === 1 ? "" : "s"} {datos.jurados_totales === 1 ? "calificó" : "calificaron"}{" "}
              todas las fotografías. Estos son los ganadores finales.
            </p>

            {datos.categorias.map((categoria) => (
              <TablaCategoria key={categoria.clave} categoria={categoria} juradosTotales={datos.jurados_totales} />
            ))}
          </>
        )}
      </main>
    </div>
  );
}
