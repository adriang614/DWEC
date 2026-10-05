// TABLA A: Guardamos en un objeto cuánto le sumamos (+) o le restamos (-) al precio según como esté el juego.
// Si pones 'nuevo-precintado' te da 0.25 (un 25% más), si pones 'solo-cartucho' te da -0.30 (un 30% menos).
export const ajuste_estado = {
  'nuevo-precintado': 0.25,   // Le suma un 25% al precio
  'usado-como-nuevo': 0.00,   // Se queda igual
  'usado-caja-danada': -0.15, // Le descuenta un 15%
  'solo-cartucho': -0.30      // Le descuenta un 30%
};

// TABLA B: Le pasamos cuántos juegos se llevan y nos dice qué descuento le regalamos por comprar en cantidad.
export const obtenerDescuentoVolumen = (cantidad) => {
  if (cantidad >= 4) return 0.10; // Si compra 4 o más, le descontamos un 10%
  if (cantidad >= 2) return 0.05; // Si compra 2 o 3, le descontamos un 5%
  return 0.00;                   // Si solo compra 1, no hay descuento (0%)
};

// TABLA C: La cifra límite para saber si nos quedan pocos juegos en la tienda.
// Si el stock baja de 3, le pondremos el aviso de "! Stock bajo".
export const umbral_stock_bajo = 3;