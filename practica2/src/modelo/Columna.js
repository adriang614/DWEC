// Columna.js — Bloque A · ✍️ A2: una columna del tablero («Por hacer», «En curso», «Hecho»).
// En kanban, una columna puede tener un límite WIP (Work In Progress): «En curso» no admite más
// de 3 tareas a la vez, para no empezar mil cosas y no acabar ninguna.
import { Tarea } from "./Tarea.js";

export class Columna {
  // Privado: #tareas, un array
  #tareas= [];


  constructor(nombre, limiteWip = null) {
    // 1 · nombre: texto no vacío (sin espacios a los lados) → si no, TypeError
    //     limiteWip: null (sin límite) o un entero ≥ 1 → si no, RangeError
    if(nombre.trim() === "") {
      throw new TypeError ("El nombre no puede estar vacío")
    }
    if(!limiteWip === null || limiteWip < 1) {
      throw new RangeError ("Debe ser sin límite y entero >= 1")
    }
  }

  // 2 · get llena: true si hay límite y ya hay tantas tareas como el límite
  get llena() {
    return this.limiteWip !== null && this.#tareas.length >= this.limiteWip;
  }

  // 3 · get tareas: una COPIA del array (que nadie pueda tocar el tuyo desde fuera)
  get tareas() {
    return [...this.#tareas]
  }

    // 4 · añadir(tarea): TypeError si no es instanceof Tarea · Error («… está llena …») si está
  //     llena · si no, la guarda y la devuelve
  añadir(tarea) {
    // Validar que sea una instancia de la clase Tarea
    if (!(tarea instanceof Tarea)) {
      throw new TypeError("Lo que se añada debe ser una instancia de Tarea.");
    }

    // Validar si la lista está llena (asumiendo que tienes un límite máximo)
    // Nota: Reemplaza 'this.#LIMITE_MAXIMO' por tu variable real o condición de llenado
    if (this.#tareas.length >= this.limiteWip) {
      throw new Error("La lista de tareas está llena.");
    }

    // Si pasa las validaciones, se guarda en el array y se devuelve
    this.#tareas.push(tarea);
    return tarea;
  }


  // 5 · quitar(id): la saca del array y la devuelve · Error («… no está …») si no la encuentra
  //     Pista: findIndex + splice
  quitar(id) {
    const idEliminado = this.#tareas.findIndex(tarea => tarea.id === id);

    if (findIndex === -1) {
      throw new Error ("No se ha encontrado el id deseado")
    }

    const [tareaEliminada] = this.#tareas.splice(idEliminado, 1);

    return tareaEliminada;
  }

  // 6 · tiene(id): true / false. Pista: some
  tiene(id) {
    return this.#tareas.some(tarea => tarea.id === id);
  }

    // 7 · ordenadas(): un array NUEVO ordenado: primero prioridad alta (usa t.peso), y a igual
  //     prioridad, el límite más cercano; las que no tienen límite, al final.
  //     Pista: [...this.#tareas].sort((a, b) => …) — ¿por qué la copia?
  ordenadas() {
    return [...this.#tareas].sort((a, b) => {
      // Comparar por prioridad (peso) de mayor a menor
      if (b.peso !== a.peso) {
        return b.peso - a.peso;
      }

      // 2. Si tienen igual prioridad, comparar por fecha límite
      // Si ambas no tienen límite, mantienen su posición relativa
      if (!a.limite && !b.limite) return 0;
      // Si a no tiene límite, se va al final (gana b)
      if (!a.limite) return 1;
      // Si b no tiene límite, se va al final (gana a)
      if (!b.limite) return -1;

      // Si ambas tienen límite, la más cercana (menor fecha) va primero
      return new Date(a.limite) - new Date(b.limite);
    });
  }
}

// Comprueba con:  docker compose run --rm web npm test 3-columna
void Tarea; // (borra esta línea cuando uses Tarea)