import { Navigate } from "react-router-dom";
import { useJuradoAuth } from "./JuradoAuthContext";

export default function RutaProtegidaJurado({ children }) {
  const { autenticado } = useJuradoAuth();

  if (!autenticado) {
    return <Navigate to="/jurado/login" replace />;
  }

  return children;
}
