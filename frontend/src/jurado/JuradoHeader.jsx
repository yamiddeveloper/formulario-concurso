import { Link, NavLink } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";

function enlaceActivo({ isActive }) {
  return `jurado-nav-link${isActive ? " is-active" : ""}`;
}

export default function JuradoHeader() {
  const { nombre, cerrarSesion } = useJuradoAuth();

  return (
    <header className="jurado-header">
      <Link to="/jurado" className="jurado-brand">
        <span className="jurado-brand-nombre">Concurso fotográfico</span>
        <span className="jurado-brand-tag">Jurado</span>
      </Link>

      <nav className="jurado-nav" aria-label="Navegación del jurado">
        <NavLink to="/jurado" end className={enlaceActivo}>
          Galería
        </NavLink>
        <NavLink to="/jurado/resultados" className={enlaceActivo}>
          Resultados
        </NavLink>
      </nav>

      <div className="jurado-header-actions">
        {nombre && <span className="jurado-header-nombre">{nombre}</span>}
        <button type="button" className="jurado-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
