const formateadorCompleto = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

const formateadorFecha = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "full",
  timeZone: "America/Bogota",
});

const formateadorHora = new Intl.DateTimeFormat("es-CO", {
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export function formatearFechaColombia(fecha) {
  return `${formateadorCompleto.format(new Date(fecha))} (hora de Colombia)`;
}

// Devuelve fecha y hora por separado para poder darles distinta jerarquia
// visual (la fecha grande, la hora como dato secundario).
export function partirFechaColombia(fecha) {
  const valor = new Date(fecha);
  return {
    fecha: formateadorFecha.format(valor),
    hora: formateadorHora.format(valor),
  };
}
