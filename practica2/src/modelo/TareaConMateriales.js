import { Tarea } from "./Tarea.js";
import { FaltaMaterialError } from "./errores.js";
export class TareaConMateriales extends Tarea {
  #materiales;
  constructor(titulo, prioridad, limite, materiales) {
    super(titulo, prioridad, limite);
    this.#materiales = materiales.map((nombre) => ({
      nombre: nombre,
      unidades: 0,
    }));
  }
  get materiales() {
    return this.#materiales.map((material) => ({
      ...material,
    }));
  }
  contar(nombre, unidades) {
    const material = this.#materiales.find((m) => m.nombre === nombre);
    if (!material || !Number.isInteger(unidades) || unidades < 0) {
      throw new RangeError("Material o unidades no válidos");
    }
    material.unidades = unidades;
  }
  comprobarMovimiento(destino) {
    if (destino !== "En curso") return;
    const faltan = this.#materiales.filter((m) => m.unidades === 0).map((m) => m.nombre);
    if (faltan.length > 0) {
      throw new FaltaMaterialError(faltan);
    }
  }
}
