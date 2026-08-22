export const NOMBRES_PASO = ["Participante", "Fotografía", "Historia", "Confirmación"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProgressSteps({ paso, totalPasos, pasosCompletados }) {
  return (
    <div className="progress-steps">
      <p className="progress-steps-label">
        Paso {paso} de {totalPasos} · {NOMBRES_PASO[paso - 1]}
      </p>

      <ol className="stepper" aria-label="Progreso de la inscripción">
        {NOMBRES_PASO.slice(0, totalPasos).map((nombre, indice) => {
          const numero = indice + 1;
          const completado = pasosCompletados.has(numero);
          const actual = numero === paso;
          return (
            <li
              key={nombre}
              className={`stepper-item${completado ? " is-completed" : ""}${actual ? " is-current" : ""}`}
              aria-current={actual ? "step" : undefined}
            >
              <span className="stepper-marker" aria-hidden="true">
                {completado ? <CheckIcon /> : numero}
              </span>
              <span className="stepper-label">{nombre}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
