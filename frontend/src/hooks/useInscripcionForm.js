import { useEffect, useMemo, useState } from "react";
import { enviarInscripcion, ApiError } from "../lib/api";
import { validarParticipante, validarFotografia, validarHistoria, validarCampo } from "../lib/validation";

const DATOS_INICIALES = {
  nombres: "",
  apellidos: "",
  fecha_nacimiento: "",
  es_estudiante: null,
  institucion: "",
  titulo: "",
  lugar: "",
  categoria: "",
  imagen: null,
  porque_tomo_la_foto: "",
  que_quiere_mostrar: "",
  significado_del_lugar: "",
};

// La fotografía (File) no se persiste: los navegadores no permiten
// serializar archivos, así que al restaurar un borrador el usuario debe
// volver a adjuntarla. Tampoco guardamos más tiempo del necesario datos
// personales del participante en el navegador de lo estrictamente útil.
const CLAVE_BORRADOR = "chitaga-inscripcion-borrador";

function cargarBorrador() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_BORRADOR);
    if (!guardado) return null;
    return JSON.parse(guardado);
  } catch {
    return null;
  }
}

function guardarBorrador(paso, datos) {
  try {
    const { imagen: _imagen, ...datosSerializables } = datos;
    window.localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ paso, datos: datosSerializables }));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena, etc.): el
    // formulario sigue funcionando, simplemente sin autosave.
  }
}

function borrarBorrador() {
  try {
    window.localStorage.removeItem(CLAVE_BORRADOR);
  } catch {
    /* noop */
  }
}

const CAMPO_A_PASO = {
  nombres: 1,
  apellidos: 1,
  fecha_nacimiento: 1,
  es_estudiante: 1,
  institucion: 1,
  titulo: 2,
  lugar: 2,
  categoria: 2,
  imagen: 2,
  porque_tomo_la_foto: 3,
  que_quiere_mostrar: 3,
  significado_del_lugar: 3,
};

const VALIDADORES_POR_PASO = {
  1: validarParticipante,
  2: validarFotografia,
  3: validarHistoria,
};

export const TOTAL_PASOS = 4;

export function useInscripcionForm() {
  const [borradorInicial] = useState(cargarBorrador);
  // La fotografía nunca se restaura (no es serializable), así que si el
  // borrador dejaba al usuario más allá del paso de fotografía, lo hacemos
  // volver a ese paso para que la vuelva a adjuntar antes de continuar.
  const [paso, setPaso] = useState(() =>
    borradorInicial ? Math.min(borradorInicial.paso || 1, 2) : 1,
  );
  const [datos, setDatos] = useState({ ...DATOS_INICIALES, ...borradorInicial?.datos });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("editando"); // editando | enviando | exito | error
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (estado === "editando" || estado === "error") {
      guardarBorrador(paso, datos);
    }
  }, [paso, datos, estado]);

  function actualizarCampo(campo, valor) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => {
      if (!prev[campo]) return prev;
      const siguiente = { ...prev };
      delete siguiente[campo];
      return siguiente;
    });
  }

  function validarAlPerderFoco(campo, valorOverride) {
    const datosParaValidar = valorOverride === undefined ? datos : { ...datos, [campo]: valorOverride };
    const mensaje = validarCampo(paso, campo, datosParaValidar);
    setErrores((prev) => {
      if (!mensaje) {
        if (!prev[campo]) return prev;
        const siguiente = { ...prev };
        delete siguiente[campo];
        return siguiente;
      }
      return { ...prev, [campo]: mensaje };
    });
  }

  // Volver atras siempre es seguro (los datos se conservan). Saltar hacia
  // adelante solo se permite si todos los pasos intermedios ya validan: de
  // otro modo se podria llegar a la confirmacion salteando la validacion.
  function puedeIrAlPaso(numero) {
    if (numero === paso || numero < 1 || numero > TOTAL_PASOS) return false;
    if (numero < paso) return true;
    for (let n = 1; n < numero; n += 1) {
      const validar = VALIDADORES_POR_PASO[n];
      if (validar && Object.keys(validar(datos)).length > 0) return false;
    }
    return true;
  }

  function irAlPaso(numero) {
    if (!puedeIrAlPaso(numero)) return;
    setErrores({});
    setPaso(numero);
  }

  function avanzar() {
    const validar = VALIDADORES_POR_PASO[paso];
    if (validar) {
      const nuevosErrores = validar(datos);
      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return;
      }
    }
    setErrores({});
    setPaso((prev) => Math.min(prev + 1, TOTAL_PASOS));
  }

  function retroceder() {
    setErrores({});
    setPaso((prev) => Math.max(prev - 1, 1));
  }

  async function enviar() {
    setEstado("enviando");
    setErrorGeneral(null);
    try {
      const inscripcion = await enviarInscripcion(datos);
      setResultado(inscripcion);
      setEstado("exito");
      borrarBorrador();
    } catch (err) {
      setEstado("error");
      if (err instanceof ApiError && err.detalles.length > 0) {
        const erroresPorCampo = Object.fromEntries(err.detalles.map((d) => [d.campo, d.mensaje]));
        setErrores(erroresPorCampo);
        const primerCampo = err.detalles[0].campo;
        const pasoConError = CAMPO_A_PASO[primerCampo];
        if (pasoConError) setPaso(pasoConError);
        setErrorGeneral("Hay datos por corregir en el formulario.");
      } else {
        setErrorGeneral(err.message || "Ocurrió un error al enviar tu participación.");
      }
    }
  }

  const pasosCompletados = useMemo(() => {
    const completados = new Set();
    for (let n = 1; n < paso; n += 1) {
      const validar = VALIDADORES_POR_PASO[n];
      if (validar && Object.keys(validar(datos)).length === 0) {
        completados.add(n);
      }
    }
    return completados;
  }, [paso, datos]);

  return {
    paso,
    totalPasos: TOTAL_PASOS,
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
    puedeIrAlPaso,
    enviar,
  };
}
