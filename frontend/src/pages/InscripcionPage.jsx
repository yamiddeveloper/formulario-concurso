import { useEffect, useRef, useState } from "react";
import { useInscripcionForm } from "../hooks/useInscripcionForm";
import { obtenerEstadoInscripciones } from "../lib/api";
import ProgressSteps, { NOMBRES_PASO } from "../components/ProgressSteps";
import StepParticipante from "../components/StepParticipante";
import StepFotografia from "../components/StepFotografia";
import StepHistoria from "../components/StepHistoria";
import StepConfirmacion from "../components/StepConfirmacion";
import SuccessScreen from "../components/SuccessScreen";
import VentanaInscripcionCerrada from "../components/VentanaInscripcionCerrada";
import Button from "../components/Button";

export default function InscripcionPage() {
  const {
    paso,
    totalPasos,
    datos,
    errores,
    estado,
    errorGeneral,
    resultado,
    pasosCompletados,
    actualizarCampo,
    validarAlPerderFoco,
    avanzar,
    retroceder,
    irAlPaso,
    enviar,
  } = useInscripcionForm();

  const enviando = estado === "enviando";
  const esPrimeraRenderizacion = useRef(true);
  const [ventana, setVentana] = useState(null);

  useEffect(() => {
    let cancelado = false;
    obtenerEstadoInscripciones()
      .then((res) => {
        if (!cancelado) setVentana(res);
      })
      .catch(() => {
        // Si no se puede verificar, dejamos que el usuario intente: el
        // envío real igual queda protegido por el backend.
        if (!cancelado) setVentana({ abierta: true });
      });
    return () => {
      cancelado = true;
    };
  }, []);

  // Al cambiar de paso, mueve el foco al encabezado del nuevo paso: sin esto,
  // un usuario de teclado o lector de pantalla se queda "anclado" donde
  // estaba el botón Continuar/Atrás en el paso anterior.
  useEffect(() => {
    if (esPrimeraRenderizacion.current) {
      esPrimeraRenderizacion.current = false;
      return;
    }
    document.getElementById("paso-titulo")?.focus();
  }, [paso]);

  const mostrarWizard = ventana?.abierta && estado !== "exito";
  // Cuando las inscripciones no estan abiertas no hay tarea que completar:
  // la pantalla se convierte en un unico mensaje a pantalla completa, sin
  // encabezado ni marco de formulario compitiendo por atencion.
  const ventanaCerrada = Boolean(ventana) && !ventana.abierta;

  return (
    <div className="app-shell">
      {!ventanaCerrada && (
        <header className="app-header">
          <p className="brand">Concurso de Fotografía Chitagá</p>
          {mostrarWizard && (
            <ProgressSteps paso={paso} totalPasos={totalPasos} pasosCompletados={pasosCompletados} />
          )}
        </header>
      )}

      <p className="visually-hidden" role="status" aria-live="polite">
        {mostrarWizard && `Paso ${paso} de ${totalPasos}: ${NOMBRES_PASO[paso - 1]}`}
      </p>

      <main className={`app-main${ventanaCerrada ? " app-main-pleno" : ""}`}>
        <div className={`form-card${ventanaCerrada ? " form-card-pleno" : ""}`}>
          {!ventana ? null : !ventana.abierta ? (
            <VentanaInscripcionCerrada motivo={ventana.motivo} inicio={ventana.inicio} fin={ventana.fin} />
          ) : estado === "exito" ? (
            <SuccessScreen resultado={resultado} />
          ) : (
            <div key={paso} className="step-transition">
              {paso === 1 && (
                <StepParticipante
                  datos={datos}
                  errores={errores}
                  actualizarCampo={actualizarCampo}
                  alPerderFoco={validarAlPerderFoco}
                />
              )}
              {paso === 2 && (
                <StepFotografia
                  datos={datos}
                  errores={errores}
                  actualizarCampo={actualizarCampo}
                  alPerderFoco={validarAlPerderFoco}
                />
              )}
              {paso === 3 && (
                <StepHistoria
                  datos={datos}
                  errores={errores}
                  actualizarCampo={actualizarCampo}
                  alPerderFoco={validarAlPerderFoco}
                />
              )}
              {paso === 4 && (
                <StepConfirmacion datos={datos} onEditar={irAlPaso} errorGeneral={errorGeneral} />
              )}

              <div className={`step-actions${paso === 1 ? " step-actions-end" : ""}`}>
                {paso > 1 && (
                  <Button variant="secondary" type="button" onClick={retroceder} disabled={enviando}>
                    Atrás
                  </Button>
                )}

                {paso < totalPasos && (
                  <Button variant="primary" type="button" onClick={avanzar}>
                    Continuar
                  </Button>
                )}

                {paso === totalPasos && (
                  <Button variant="primary" type="button" onClick={enviar} loading={enviando}>
                    {enviando ? "Enviando..." : "Enviar participación"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
