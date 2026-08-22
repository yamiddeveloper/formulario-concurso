import { Routes, Route } from "react-router-dom";
import InscripcionPage from "./pages/InscripcionPage";
import { JuradoAuthProvider } from "./jurado/JuradoAuthContext";
import JuradoLoginPage from "./jurado/JuradoLoginPage";
import JuradoGaleriaPage from "./jurado/JuradoGaleriaPage";
import JuradoDetallePage from "./jurado/JuradoDetallePage";
import JuradoResultadosPage from "./jurado/JuradoResultadosPage";
import RutaProtegidaJurado from "./jurado/RutaProtegidaJurado";

export default function App() {
  return (
    <JuradoAuthProvider>
      <Routes>
        <Route path="/" element={<InscripcionPage />} />
        <Route path="/jurado/login" element={<JuradoLoginPage />} />
        <Route
          path="/jurado"
          element={
            <RutaProtegidaJurado>
              <JuradoGaleriaPage />
            </RutaProtegidaJurado>
          }
        />
        <Route
          path="/jurado/fotografias/:id"
          element={
            <RutaProtegidaJurado>
              <JuradoDetallePage />
            </RutaProtegidaJurado>
          }
        />
        <Route
          path="/jurado/resultados"
          element={
            <RutaProtegidaJurado>
              <JuradoResultadosPage />
            </RutaProtegidaJurado>
          }
        />
      </Routes>
    </JuradoAuthProvider>
  );
}
