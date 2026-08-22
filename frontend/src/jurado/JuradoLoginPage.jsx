import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";
import Button from "../components/Button";
import { JuradoApiError } from "./juradoApi";

export default function JuradoLoginPage() {
  const { autenticado, iniciarSesion } = useJuradoAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (autenticado) {
    const destino = location.state?.desde || "/jurado";
    return <Navigate to={destino} replace />;
  }

  async function alEnviar(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await iniciarSesion(usuario, password);
      navigate(location.state?.desde || "/jurado", { replace: true });
    } catch (err) {
      setError(err instanceof JuradoApiError ? err.message : "No fue posible iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="form-card jurado-login-card">
          <p className="step-context">Panel del jurado</p>
          <h1 className="step-title">Iniciar sesión</h1>
          <p className="step-description">Accede con las credenciales que te compartió la organización del concurso.</p>

          <form onSubmit={alEnviar} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="usuario">
                Usuario
              </label>
              <input
                id="usuario"
                className="input"
                type="text"
                autoComplete="username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="banner banner-error" role="alert">
                {error}
              </p>
            )}

            <div className="step-actions step-actions-end">
              <Button type="submit" variant="primary" loading={enviando}>
                {enviando ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
