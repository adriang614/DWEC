import { ajuste_estado, obtenerDescuentoVolumen, umbral_stock_bajo } from '../config/negocio.js';

// 1. CALCULAR PRECIO FINAL (Combina Tabla A + Tabla B)
// Esta función calcula el precio de un juego aplicando sus descuentos/recargos.
export function calcularPrecioVenta(precioBase, estado, cantidad = 1) {

  // Miramos en la Tabla A cuánto le sumamos o restamos por su estado (ej: -0.30 si es solo cartucho)
  const porcentajeEstado = ajuste_estado[estado] ?? 0;
  const precioAjustadoEstado = precioBase * (1 + porcentajeEstado);

  // Miramos en la Tabla B si se lleva varios juegos para aplicarle descuento por volumen
  const porcentajeDescuento = obtenerDescuentoVolumen(cantidad);
  const precioUnitarioFinal = precioAjustadoEstado * (1 - porcentajeDescuento);

  // Devolvemos el precio de un juego y el precio total de la compra redondeado a 2 decimales
  return {
    precioUnitarioFinal: Number(precioUnitarioFinal.toFixed(2)),
    totalVenta: Number((precioUnitarioFinal * cantidad).toFixed(2))
  };
}

// 2. BUSCAR PRODUCTO
// Busca un juego por su ID exacto o por una palabra de su título usando .find()
export const buscarProducto = (catalogo, criterio) => {
  const termino = String(criterio).toLowerCase().trim();
  return catalogo.find(
    (producto) => producto.id === Number(termino) || producto.titulo.toLowerCase().includes(termino)
  );
};

// 3. REGISTRAR UNA VENTA (Sin modificar la lista original)
// Usa .map() para crear una LISTA NUEVA restando el stock vendido
export const registrarVenta = (catalogo, idProducto, cantidad) => {
  return catalogo.map((producto) => {
    // Si no es el juego que estamos vendiendo, lo dejamos exactamente igual
    if (producto.id !== idProducto) return producto;

    // Si nos piden más juegos de los que tenemos, mostramos error
    if (producto.stock < cantidad) {
      throw new Error(`No hay suficiente stock. Te quedan: ${producto.stock} unidades`);
    }

    // Copiamos el producto con '...' y le restamos la cantidad comprada a su stock
    return { ...producto, stock: producto.stock - cantidad };
  });
};

// 4. REPONER STOCK (Sin modificar la lista original - Inmutabilidad)
// Suma unidades al stock de un juego usando .map()
export const reponerStock = (catalogo, idProducto, cantidad) => {
  return catalogo.map((producto) => {
    if (producto.id !== idProducto) return producto;
    return { ...producto, stock: producto.stock + cantidad };
  });
};

// 5. DAR FORMATO A UN PRODUCTO
// Prepara la frase para mostrar en pantalla, añadiendo el aviso de stock bajo si le quedan menos de 3
export const formatearProducto = (producto) => {
  const avisoStock = producto.stock < umbral_stock_bajo ? ' ⚠️ ! Stock bajo' : '';
  return `[ID: ${producto.id}] ${producto.titulo} (${producto.plataforma}) | Cat: ${producto.categoria} | Estado: ${producto.estado} | Precio Base: ${producto.precioBase}€ | Stock: ${producto.stock}${avisoStock}`;
};