import Field, { describedBy } from "./Field";

const LARGO_MAXIMO = 1000;

function Contador({ valor }) {
  return (
    <p className="field-counter">
      {valor.length}/{LARGO_MAXIMO}
    </p>
  );
}

export default function StepHistoria({ datos, errores, actualizarCampo, alPerderFoco }) {
  return (
    <section aria-labelledby="paso-titulo">
      <header className="step-header">
        <p className="step-context">Detrás de la foto</p>
        <h1 className="step-title" id="paso-titulo" tabIndex={-1}>
          Cuéntanos tu historia
        </h1>
        <p className="step-description">
          Tus palabras acompañan la fotografía. Cuéntanos con tus propias palabras.
        </p>
      </header>

      <Field
        label="¿Por qué tomaste esta fotografía?"
        htmlFor="porque_tomo_la_foto"
        required
        error={errores.porque_tomo_la_foto}
        counter={<Contador valor={datos.porque_tomo_la_foto} />}
      >
        <textarea
          id="porque_tomo_la_foto"
          className="textarea"
          maxLength={LARGO_MAXIMO}
          value={datos.porque_tomo_la_foto}
          onChange={(e) => actualizarCampo("porque_tomo_la_foto", e.target.value)}
          onBlur={() => alPerderFoco("porque_tomo_la_foto")}
          aria-invalid={Boolean(errores.porque_tomo_la_foto)}
          aria-describedby={describedBy("porque_tomo_la_foto", errores)}
        />
      </Field>

      <Field
        label="¿Qué quieres mostrarnos con esta fotografía?"
        htmlFor="que_quiere_mostrar"
        required
        error={errores.que_quiere_mostrar}
        counter={<Contador valor={datos.que_quiere_mostrar} />}
      >
        <textarea
          id="que_quiere_mostrar"
          className="textarea"
          maxLength={LARGO_MAXIMO}
          value={datos.que_quiere_mostrar}
          onChange={(e) => actualizarCampo("que_quiere_mostrar", e.target.value)}
          onBlur={() => alPerderFoco("que_quiere_mostrar")}
          aria-invalid={Boolean(errores.que_quiere_mostrar)}
          aria-describedby={describedBy("que_quiere_mostrar", errores)}
        />
      </Field>

      <Field
        label="¿Qué significa este lugar para ti?"
        htmlFor="significado_del_lugar"
        required
        error={errores.significado_del_lugar}
        counter={<Contador valor={datos.significado_del_lugar} />}
      >
        <textarea
          id="significado_del_lugar"
          className="textarea"
          maxLength={LARGO_MAXIMO}
          value={datos.significado_del_lugar}
          onChange={(e) => actualizarCampo("significado_del_lugar", e.target.value)}
          onBlur={() => alPerderFoco("significado_del_lugar")}
          aria-invalid={Boolean(errores.significado_del_lugar)}
          aria-describedby={describedBy("significado_del_lugar", errores)}
        />
      </Field>
    </section>
  );
}
