// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  // 1 hay algo guardado y válido?
  const guardado = cargar(CLAVE, null, storage);
  if (guardado !== null) {
    try {
      return { tablero: Tablero.desdeJSON(guardado), origen: "guardado" };
    } catch {
      borrar(CLAVE, storage);
    }
  }

  // 2 descargar las iniciales
  try {
    const datos = await obtenerJSON(url, fetchFn);
    return { tablero: Tablero.desde(datos, limiteEnCurso), origen: "inicial" };
  } catch (error) {
    // 3 tablero vacío sin lanzar
    return {
      tablero: new Tablero(limiteEnCurso),
      origen: "vacio",
      error: error.message,
    };
  }
}
