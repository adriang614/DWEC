// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube
  // Privado: #columnas, un Map nombre → Columna
  #columnas = new Map();

  // ✍️ A3 ──────────────────────────────────────────────────────────────────────
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    for (const nombre of Tablero.COLUMNAS) {
      let limite = null;
      if (nombre === "En curso") {
        limite = limiteEnCurso;
      }
      this.#columnas.set(nombre, new Columna(nombre, limite));
    }
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)
  static desde (datos, limiteEnCurso) {
    const tablero = new Tablero(limiteEnCurso);
    for (const dato of datos) {
      tablero.crearTarea(dato);
    }
    return tablero;
  }

  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  columna(nombre) {
    const columna = this.#columnas.get(nombre);
    if (!columna) {
      throw new Error(`No existe la columna "${nombre}".`);
    }
    return columna;
  }

  // get columnas: array con las tres columnas, en orden
  get columnas() {
    return [...this.#columnas.values()]; //[] lo hace array, .values() porque es un map y me hacen falta las columnas
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)
  crearTarea(datos) {
    const {titulo, prioridad, limite, cadaDias} = datos;

    let tarea;
    if (cadaDias) {
      tarea = new TareaRecurrente(titulo, prioridad, limite, cadaDias);
    } else {
      tarea = new Tarea(titulo, prioridad, limite);
    }

    this.columna("Por hacer").añadir(tarea);
    return tarea;
  }

  // buscar(id): la tarea, esté en la columna que esté, o null
  buscar(id) {
    const columna = this.dondeEsta(id);
    if (columna === null) {
      return null;
    }
    return columna.tareas.find((t) => t.id === id);
  }
  
  // dondeEsta(id): la Columna donde está, o null
  dondeEsta(id) {
    for (const columna of this.#columnas.values()) {
      if (columna.tiene(id)) {
        return columna;
      }
    }
    return null;
  }

    // lo uso en mover y completar para no repetir las comprobaciones
  #trasladar(id, destino) {
    const origen = this.dondeEsta(id);
    if (origen === null) {
      throw new Error(`No existe la tarea ${id}.`);
    }

    const columnaDestino = this.columna(destino);

    // de hecho no se puede sacar
    if (origen.nombre === "Hecho") {
      throw new MovimientoNoPermitidoError(id, origen.nombre, destino);
    }
    // ni mover a la misma columna
    if (origen === columnaDestino) {
      throw new MovimientoNoPermitidoError(id, origen.nombre, destino);
    }

    // si el destino está lleno
    if (columnaDestino.llena) {
      throw new ColumnaLlenaError(columnaDestino);
    }

    // ya está comprobado, ahora la muevo
    const tarea = origen.quitar(id);
    columnaDestino.añadir(tarea);
    return tarea;
  }

  // mover(id, destino): Error si no existe la tarea, Error si la columna destino está llena
  //   (comprueba antes de quitarla de su columna, o se perdería) la mueve y la devuelve
  mover(id, destino) {
    return this.#trasladar(id, destino);
  }

  // completar(id): la mueve a Hecho y añade a Por hacer lo que devuelva tarea.alCompletar()
  //   Sin preguntar si es recurrente: eso es el polimorfismo
  completar(id) {
    const tarea = this.#trasladar(id, "Hecho");

    // devuelve un array: vacío si es normal, con la siguiente si es recurrente
    const siguientes = tarea.alCompletar();
    for (const siguiente of siguientes) {
      this.columna("Por hacer").añadir(siguiente);
    }

    return tarea;
  }

  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»
  resumen(hoy = new Date()) {
    let vencidas = 0;

    for (const columna of this.#columnas.values()) {
      if (columna.nombre === "Hecho") {
        continue;
      }
      for (const tarea of columna.tareas) {
        if (tarea.estaVencida(hoy)) {
          vencidas++;
        }
      }
    }

    return {
      porHacer: this.columna("Por hacer").tareas.length,
      enCurso: this.columna("En curso").tareas.length,
      hecho: this.columna("Hecho").tareas.length,
      vencidas,
    };
  }

  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.

  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.
  toJSON() {
    const columnas = {};
    for (const nombre of Tablero.COLUMNAS) {
      columnas[nombre] = this.columna(nombre).tareas.map((tarea) => aDatos(tarea));
    }
    return {
      version: Tablero.VERSION_DATOS,
      limiteEnCurso: this.columna("En curso").limiteWip,
      columnas,
    };
  }

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    if (!datos || datos.version !== Tablero.VERSION_DATOS) {
      throw new Error("Datos del tablero no válidos o de otra versión");
    }

    const tablero = new Tablero(datos.limiteEnCurso);
    for (const nombre of Tablero.COLUMNAS) {
      for (const objeto of datos.columnas?.[nombre] ?? []) {
        tablero.columna(nombre).añadir(desdeDatos(objeto));
      }
    }
    return tablero;
  }
}

// Comprueba con:  docker compose run --rm web npm test bloque-a