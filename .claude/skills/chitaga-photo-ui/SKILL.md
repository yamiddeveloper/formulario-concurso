---
name: chitaga-photo-ui
description: Diseña e implementa interfaces web para el concurso de fotografía de Chitagá, con una dirección visual minimalista, editorial, cálida y centrada en las fotografías. Úsala al crear, rediseñar o revisar páginas, formularios, componentes, flujos de inscripción, galerías y estados de la experiencia.
---

# Chitagá Photo UI

## Propósito

Construye interfaces que hagan que el concurso se sienta como una **experiencia de fotografía y territorio**, no como un formulario administrativo.

La dirección visual combina:

* Minimalismo.
* Diseño editorial.
* Fotografía como contenido protagonista.
* Identidad local.
* Calidez.
* Interacciones simples y claras.

El público tiene entre **14 y 28 años**. La interfaz debe ser juvenil y cercana sin resultar infantil.

> **Principio rector:** parece una experiencia de fotografía, no un formulario con fotografías.

---

## 1. Antes de diseñar

Primero inspecciona el proyecto.

Revisa:

1. `AGENTS.md` y cualquier `SKILL.md` aplicable.
2. Framework y dependencias existentes.
3. Componentes reutilizables.
4. Design tokens, variables y estilos existentes.
5. Tipografías.
6. Rutas y estructura de navegación.
7. Patrones de formularios y feedback.
8. Tests y herramientas de validación.
9. Si existe, el diseño visual ya implementado.

No introduzcas un sistema visual paralelo si el proyecto ya tiene uno.

Si falta información visual importante, toma decisiones razonables basadas en el contexto del concurso y documenta las decisiones relevantes.

---

## 2. Dirección visual

### Concepto

**Chitagá a través de mis ojos.**

La interfaz debe transmitir:

* Cercanía.
* Creatividad.
* Territorio.
* Naturaleza.
* Juventud.
* Narrativa.
* Sencillez.

La estética debe sentirse **editorial y contemporánea**, con suficiente personalidad para no parecer una plantilla SaaS.

Evita deliberadamente:

* Dashboards empresariales genéricos.
* Formularios gubernamentales.
* Plantillas SaaS intercambiables.
* Estética infantil.
* Decoración sin función.
* Patrones visuales típicos de interfaces generadas automáticamente.

La identidad debe provenir principalmente de **tipografía, composición, fotografía, espacio y color**, no de efectos.

---

## 3. Sistema visual

### Colores de marca

```text
Primary:    #F25C05
Background: #FCFDFF
Success:    #458C57
```

Roles:

* `#F25C05`: acción principal, identidad y elementos destacados.
* `#FCFDFF`: fondo y superficies principales.
* `#458C57`: éxito, inscripción completada y confirmaciones positivas.

Centraliza los colores mediante tokens o variables.

No repitas valores hexadecimales arbitrariamente en los componentes.

### Colores semánticos

La paleta de marca no debe impedir una UI accesible.

Cuando sea necesario, utiliza colores semánticos apropiados para:

* Error.
* Warning.
* Información.
* Estados disabled.

Estos deben integrarse de forma discreta y coherente con la identidad visual.

Nunca comuniques un estado únicamente mediante color.

---

## 4. Composición

Diseña cada pantalla alrededor de una tarea principal.

La jerarquía habitual debe ser:

```text
Contexto
↓
Título
↓
Descripción breve
↓
Contenido principal
↓
Acción principal
```

Elimina elementos que no ayuden a:

* Entender.
* Decidir.
* Navegar.
* Completar una tarea.
* Crear identidad.

Utiliza espacio negativo como parte activa del diseño.

No llenes espacios únicamente porque estén disponibles.

Evita centrar todo por defecto. La alineación debe responder a la jerarquía y al contenido.

---

## 5. Fotografía

La fotografía es el contenido principal del producto.

Cuando exista una fotografía:

* Dale protagonismo visual.
* Conserva su relación de aspecto siempre que sea posible.
* Evita marcos decorativos innecesarios.
* Evita overlays que dificulten verla.
* Utiliza `object-fit` correctamente.
* Optimiza imágenes para rendimiento.
* Utiliza lazy loading cuando corresponda.

En galerías, utiliza una composición editorial cuando mejore la presentación de las fotografías.

No uses fotografías de stock como sustituto del contenido real si el proyecto dispone de fotografías del concurso.

---

## 6. Flujo de inscripción

El flujo debe sentirse progresivo y ligero.

Preferir una experiencia por pasos:

```text
1. Participante
2. Fotografía
3. Historia
4. Confirmación
```

Cada paso debe tener:

* Una intención clara.
* Título.
* Explicación breve.
* Campos relacionados.
* Acción principal.
* Navegación comprensible.

Utiliza progressive disclosure cuando reduzca la carga cognitiva.

Por ejemplo:

```text
es_estudiante = true
→ mostrar institución
```

```text
es_estudiante = false
→ no mostrar institución
```

No muestres información que todavía no sea relevante.

---

## 7. Formularios

Los formularios deben ser fáciles de escanear y completar.

### Inputs

Preferir:

* Labels visibles.
* Campos suficientemente grandes para touch.
* Focus visible.
* Estados claros.
* Errores asociados al campo.
* Ayuda contextual únicamente cuando sea necesaria.

El placeholder nunca reemplaza al label.

Evitar:

* Formularios excesivamente densos.
* Inputs pequeños.
* Labels ambiguos.
* Iconos decorativos dentro de cada campo.
* Bordes y sombras innecesarios.

### Copy

Usa lenguaje humano.

Preferir:

> Cuéntanos por qué elegiste esta fotografía.

sobre:

> Introduzca la descripción.

Preferir:

> ¿Qué quieres mostrarnos con esta fotografía?

sobre:

> Descripción de imagen.

El tono debe ser cercano, claro, positivo y respetuoso.

No infantilices al participante.

---

## 8. Acciones

Cada pantalla debe tener una acción primaria claramente identificable.

El CTA principal utiliza el naranja de marca:

```text
background: #F25C05
color: #FCFDFF
```

Utiliza verbos específicos:

```text
Continuar
Subir fotografía
Guardar historia
Enviar participación
```

Evita acciones ambiguas como:

```text
OK
Submit
Click aquí
```

No conviertas todos los botones en acciones primarias.

La jerarquía debe distinguir:

```text
Primary
Secondary
Tertiary
```

---

## 9. Upload de fotografía

El upload es una parte importante de la experiencia.

### Antes de seleccionar

Comunica claramente:

```text
Sube tu fotografía
Selecciona una imagen desde tu dispositivo
```

### Después de seleccionar

Mostrar:

* Preview.
* Estado de carga.
* Información relevante.
* Opción para reemplazar la imagen.
* Error si la imagen no es válida.

Nunca ocultes silenciosamente un error de upload.

Si existe una restricción de formato o tamaño, comunícala antes o durante la selección.

---

## 10. Estados

No diseñes únicamente el estado ideal.

Para cualquier componente interactivo, considera cuando corresponda:

```text
default
hover
focus
active
disabled
loading
error
success
empty
```

Para el flujo de inscripción:

```text
idle
editing
validating
uploading
submitting
success
error
```

Los estados deben ser comprensibles sin depender únicamente del color.

Los estados de loading deben evitar dobles envíos.

---

## 11. Éxito

La inscripción completada debe sentirse como un momento de cierre.

Usa:

```text
#458C57
```

como color principal del estado positivo.

La confirmación debe responder claramente:

1. ¿Se envió?
2. ¿Qué se recibió?
3. ¿Qué ocurre ahora?

Ejemplo conceptual:

```text
Participación registrada

Recibimos tu fotografía y tu historia correctamente.
```

La celebración debe ser breve y elegante.

No utilizar confeti o animaciones llamativas por defecto.

---

## 12. Tipografía

La tipografía debe aportar carácter editorial sin sacrificar legibilidad.

Mantén una jerarquía clara entre:

```text
Display / Heading
Body
Label / Utility
```

Prioriza:

* Legibilidad.
* Contraste.
* Longitud de línea razonable.
* Escala consistente.
* Jerarquía visual.

Si ya existe una tipografía definida en el proyecto, reutilízala.

No añadas una fuente únicamente para conseguir un efecto visual.

---

## 13. Espaciado y superficies

Utiliza una escala consistente de spacing.

El espacio debe ayudar a separar:

* Secciones.
* Grupos de campos.
* Contenido y acciones.
* Fotografía y metadatos.

No uses cards como contenedores universales.

Una card debe existir porque agrupa una unidad conceptual real.

Preferir:

```text
espacio
+
tipografía
+
divisores sutiles
```

antes que:

```text
card
→ sombra
→ borde
→ card
→ card
```

---

## 14. Bordes y profundidad

Mantén una estética ligera.

Preferir:

* Superficies limpias.
* Bordes sutiles.
* Sombras suaves y funcionales.
* Contraste mediante tamaño, espacio y color.

No utilizar por defecto:

* Glassmorphism.
* Neumorphism.
* Gradientes decorativos.
* Sombras intensas.
* Bordes gruesos.
* Efectos 3D.

Una técnica visual solo debe utilizarse si mejora la experiencia o refuerza la identidad.

---

## 15. Iconografía

Usa una única familia de iconos consistente.

Los iconos deben ayudar a comprender una acción o estado.

No utilices emojis como iconografía principal del producto.

Un icono no debe sustituir una etiqueta textual cuando la acción pueda resultar ambigua.

---

## 16. Motion

La animación debe tener un propósito.

Puede utilizarse para:

* Feedback.
* Transiciones.
* Cambios de estado.
* Jerarquía.
* Orientación espacial.

Preferir animaciones cortas y discretas.

Evitar:

* Parallax.
* Elementos rebotando.
* Animaciones permanentes.
* Preloaders largos.
* Efectos que retrasen una tarea.

Respetar:

```css
@media (prefers-reduced-motion: reduce)
```

---

## 17. Responsive

Diseña desde el contenido, no desde una lista fija de dispositivos.

El layout debe adaptarse cuando el contenido o la interacción lo necesiten.

Comprueba como mínimo:

* Un viewport móvil estrecho.
* Un móvil/tablet amplio.
* Desktop.

Verifica:

* Reflow.
* Orden de contenido.
* Lectura.
* Tamaño de controles.
* Overflow.
* Fotografía.
* CTA principal.

No ocultes funcionalidad importante únicamente para conseguir una composición más limpia en móvil.

No dependas de `hover` para acciones esenciales.

---

## 18. Accesibilidad

Usa **WCAG 2.2 AA** como baseline de accesibilidad.

Como mínimo:

* HTML semántico.
* Labels asociados a controles.
* Nombres accesibles.
* Navegación completa por teclado.
* Focus visible.
* Orden de focus lógico.
* Contraste adecuado.
* No depender solo del color.
* Errores identificables y comprensibles.
* Imágenes con `alt` apropiado cuando corresponda.
* Reflow y zoom sin pérdida de contenido o funcionalidad.
* Motion reducido cuando el usuario lo solicite.

Para texto normal, busca al menos **4.5:1** de contraste.

Para texto grande, al menos **3:1**.

Para controles e indicadores no textuales relevantes, verifica también el contraste requerido por WCAG.

Para elementos táctiles frecuentes, prioriza aproximadamente **44×44 CSS px** cuando el espacio lo permita.

---

## 19. Performance visual

La estética no debe perjudicar el rendimiento.

Especialmente:

* Optimiza fotografías.
* Evita imágenes innecesariamente grandes.
* Evita animaciones costosas.
* Evita JavaScript para efectos que CSS puede resolver.
* Lazy-load contenido fuera del viewport cuando corresponda.
* Evita layout shifts.
* Mantén el contenido principal disponible rápidamente.

No sacrifiques rendimiento por decoración.

---

## 20. Anti-patterns

Evita patrones visuales genéricos de generación automática:

* Gradientes morado/azul sin justificación.
* Glassmorphism indiscriminado.
* Blobs decorativos.
* Bento grids por moda.
* Pills para todos los elementos.
* Cards para todo.
* Icon rows decorativas.
* Ilustraciones genéricas.
* Hero gigantes sin propósito.
* Animaciones excesivas.
* Interfaces completamente centradas.
* Mucho texto introductorio que repite el título.

No significa que estén prohibidos absolutamente.

Si utilizas alguno, debe existir una razón relacionada con el contenido o la interacción.

---

## 21. Workflow de implementación

### Antes

1. Entender la tarea.
2. Inspeccionar el proyecto.
3. Identificar componentes y tokens existentes.
4. Definir la tarea principal del usuario.
5. Definir jerarquía de contenido.
6. Identificar estados.
7. Definir comportamiento responsive.

### Durante

1. Reutilizar componentes existentes.
2. Implementar estructura semántica.
3. Aplicar tokens.
4. Implementar estados.
5. Añadir identidad visual.
6. Mantener accesibilidad.
7. Evitar dependencias nuevas salvo necesidad real.

### Después

Verifica:

* Mobile.
* Desktop.
* Loading.
* Empty.
* Error.
* Success.
* Keyboard.
* Focus.
* Reduced motion.
* Overflow.
* Imágenes.
* Contraste.
* Tipografía.
* Espaciado.

Si existen herramientas de browser/screenshot en el proyecto, utiliza **renderizado real** para comprobar la UI. No consideres suficiente revisar únicamente el código fuente.

---

## 22. Definition of Done

Una interfaz está terminada cuando:

* Resuelve claramente la tarea principal.
* Tiene una jerarquía visual intencional.
* Se reconoce como parte del concurso.
* La fotografía tiene protagonismo cuando corresponde.
* Funciona en móvil y desktop.
* Tiene estados relevantes completos.
* Es operable por teclado.
* Tiene focus visible.
* Cumple el baseline WCAG 2.2 AA.
* No depende únicamente del color.
* No introduce patrones visuales genéricos sin justificación.
* Reutiliza el sistema existente del proyecto.
* No añade complejidad innecesaria.
* Ha sido verificada en el navegador cuando las herramientas disponibles lo permiten.

---

## Principio final

Cuando tengas que elegir entre:

**más decoración**

y

**mejor comunicación**,

elige mejor comunicación.

Cuando tengas que elegir entre:

**más componentes**

y

**mejor composición**,

elige mejor composición.

Cuando tengas que elegir entre:

**una tendencia**

y

**una experiencia adecuada para el concurso**,

elige la experiencia.

El resultado debe sentirse **simple, humano, fotográfico y propio de Chitagá**.
