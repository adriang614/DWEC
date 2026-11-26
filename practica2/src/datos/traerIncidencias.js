import { obtenerJSON } from "./red.js";
import { guardarTablero } from "./persistencia.js";

const PRIORIDADES = {
  critica: "alta",
  leve: "baja",
  seria: "media",
};