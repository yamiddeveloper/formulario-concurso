// Rúbrica para evaluar una fotografía, de CeDeC (Centro Nacional de
// Desarrollo Curricular en Sistemas no Propietarios), proyecto EDIA.
// Publicada bajo licencia CC BY-SA 4.0 España.
export const NIVELES = [4, 3, 2, 1];

export const NOMBRES_NIVEL = {
  4: "Excelente",
  3: "Satisfactorio",
  2: "Mejorable",
  1: "Insuficiente",
};

export const RUBRICA = [
  {
    clave: "contenido",
    nombre: "Contenido",
    niveles: {
      4: "Del 76 al 100% de la imagen tiene contenido relevante. Los elementos significativos de la fotografía están contenidos en la imagen.",
      3: "Del 51 al 75% de la imagen tiene contenido relevante. Los elementos significativos de la fotografía están contenidos en la imagen.",
      2: "Del 26 al 50% de la imagen tiene contenido relevante. Algunos elementos significativos de la fotografía están contenidos en la imagen.",
      1: "Del 0 al 25% de la imagen tiene contenido relevante. Varios elementos significativos de la fotografía no están contenidos en la imagen.",
    },
  },
  {
    clave: "organizacion_estetica",
    nombre: "Organización estética",
    niveles: {
      4: "Se identifica el primer plano perfectamente, es de gran interés y además dirige al observador al tema principal. El tema principal destaca notablemente.",
      3: "Se identifica el primer plano perfectamente, y además dirige al observador al tema principal. El tema principal destaca.",
      2: "Resulta difícil identificar el primer plano, que no dirige al observador al tema principal. El tema principal se confunde con el primer plano.",
      1: "No se puede identificar un primer plano. Es difícil determinar cuál es el tema principal de la fotografía.",
    },
  },
  {
    clave: "creatividad",
    nombre: "Creatividad",
    niveles: {
      4: "El tema principal tiene fuerte presencia y es muy llamativo. La composición de la fotografía tiene elementos innovadores.",
      3: "El tema principal es bastante llamativo. La composición de la fotografía tiene algunos elementos innovadores.",
      2: "El tema principal es poco llamativo. La composición de la fotografía tiene algunos elementos irrelevantes.",
      1: "El tema principal es simple y escaso. La composición de la fotografía está saturada de elementos irrelevantes.",
    },
  },
  {
    clave: "tecnica",
    nombre: "Técnica",
    niveles: {
      4: "La fotografía está muy bien enfocada y el contraste es óptimo. Los reflejos y puntos brillantes están muy bien tratados. Los colores son limpios y fuertes.",
      3: "La fotografía está muy bien enfocada y el contraste es adecuado. Los reflejos y puntos brillantes son mínimos. Los colores son limpios y fuertes.",
      2: "La fotografía está desenfocada en algunas partes y el contraste es inadecuado. Aparecen algunos reflejos y puntos brillantes. Los colores son poco limpios y fuertes.",
      1: "La fotografía está desenfocada y el contraste es inadecuado. Predominan reflejos y puntos brillantes. Los colores son débiles.",
    },
  },
];

export const PUNTAJE_MINIMO = RUBRICA.length * Math.min(...NIVELES);
export const PUNTAJE_MAXIMO = RUBRICA.length * Math.max(...NIVELES);
