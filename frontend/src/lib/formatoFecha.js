const formateador = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export function formatearFechaColombia(fecha) {
  return `${formateador.format(new Date(fecha))} (hora de Colombia)`;
}
