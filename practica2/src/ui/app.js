// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  const errores = {};

  const titulo = datos.titulo ?? "";
  if (titulo === "") {
    errores.titulo = "Escribe un título";
  } else if (titulo.length > 80) {
    errores.titulo = "El título no puede pasar de 80 caracteres";
  }

  if (datos.cadaDias !== undefined) {
    if (!Number.isInteger(datos.cadaDias) || datos.cadaDias <= 0) {
      errores.cadaDias = "Debe ser un número entero mayor que 0";
    } else if (!datos.limite) {
      errores.limite = "Una tarea que se repite necesita fecha límite";
    }
  }

  return errores;
}

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.dataset.accion = accion;
  boton.textContent = texto;
  return boton;
}

const crear = (etiqueta, datos) => Object.assign(document.createElement(etiqueta), datos);

function crearFormulario(tarea) {
  const form = crear("form", { noValidate: true });
  form.dataset.form = "renombrar";
  const etiqueta = crear("label", {
    textContent: `Título nuevo de ${tarea.titulo}`,
  });
  etiqueta.append(
    crear("input", {
      name: "titulo",
      type: "text",
      value: tarea.titulo,
    }),
  );
  const error = crear("p", { className: "error" });
  error.dataset.errorDe = "titulo";
  const enviar = crear("button", {
    type: "submit",
    textContent: "Guardar",
  });
  form.append(etiqueta, error, enviar, crearBoton("Cancelar", "cancelar"));
  return form;
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    const ahora = hoy ?? new Date();

    for (const columna of tablero.columnas) {
      const zona = raiz.querySelector(`[data-columna="${columna.nombre}"]`);
      const lista = zona.querySelector(".lista");
      const contador = zona.querySelector(".contador");

      // Tarjetas en el orden de ordenadas()
      pintarLista(lista, columna.ordenadas(), ahora);

      // Botones de cada tarjeta según la columna
      for (const tarjeta of tarjetas) {
        const acciones = ACCIONES[nombreColumna];
        const id = Number(tarjeta.dataset.id);
        const tarea = tablero.buscar(id);
        for (const [texto, accion] of acciones) {
          tarjeta.append(crearBoton(texto, accion));
        }
        if (nombreColumna === "Por hacer" && tarea.limite !== null) {
          tarjeta.append(crearBoton("Renombrar y empezar", "renombrar"));
        }
      }

      // Contador
      const n = columna.tareas.length;
      contador.textContent = columna.limiteWip === null ? `(${n})` : `(${n}/${columna.limiteWip})`;
    }

    // Resumen
    const total = tablero.columnas.reduce((suma, c) => suma + c.tareas.length, 0);
    const hechas = tablero.columna("Hecho").tareas.length;
    const progreso = total === 0 ? 0 : Math.round((hechas / total) * 100);

    resumen.querySelector('[data-dato="progreso"]').textContent = `${progreso} %`;
    resumen.querySelector('[data-dato="vencidas"]').textContent = tablero.resumen(ahora).vencidas;
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.
  // B5 · una sola función para todos los cambios (también servirá para B6)
  function cambiar(accion) {
    try {
      accion();
    } catch (error) {
      if (error instanceof ErrorTablero) {
        avisar(error.message);
        return;
      }
      throw error;
    }
    avisar("");
    pintar();
    alCambiar(tablero);
  }

  delegar(columnas, "click", "button[data-accion]", (boton) => {
    const accion = boton.dataset.accion;
    const tarjeta = boton.closest(".tarjeta");
    const id = Number(tarjeta.dataset.id);
    if (accion === "empezar") {
      cambiar(() => tablero.mover(id, "En curso"));
    } else if (accion === "volver") {
      cambiar(() => tablero.mover(id, "Por hacer"));
    } else if (accion === "completar") {
      cambiar(() => tablero.completar(id));
    } else if (accion === "renombrar") {
      let formulario = tarjeta.querySelector('[data-form="renombrar"]');
      if (!formulario) {
        formulario = crearFormulario(tablero.buscar(id));
        tarjeta.append(formulario);
      }
      formulario.elements.titulo.focus();
    } else if (accion === "cancelar") {
      boton.closest("form").remove();
    }
  });

  delegar(columnas, "submit", "form", (formulario, evento) => {
    evento.preventDefault(); // sin recargar la página
    const tarea = tablero.buscar(Number(formulario.closest(".tarjeta").dataset.id));
    const valor = formulario.elements.titulo.value.trim(); // SIEMPRE un string
    const mensaje = revisar(valor, tarea, tablero, hoy ?? new Date());
    mostrarErrores(formulario, { titulo: mensaje }); // pinta o borra el mensaje bajo el campo
    if (mensaje === "") cambiar(() => aplicar(tablero, tarea, valor));
  });

  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = leerFormulario(form);
    const errores = validar(datos);
    mostrarErrores(form, errores);

    if (Object.keys(errores).length > 0) return;

    cambiar(() => tablero.crearTarea(datos));
    form.reset();
  });

  pintar();
  return { pintar };
}
