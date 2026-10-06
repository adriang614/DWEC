import { catalogoInicial } from './data/catalogo.js';
import {
  calcularPrecioVenta,
  buscarProducto,
  registrarVenta,
  reponerStock,
  formatearProducto
} from './servicios/inventario.js';

// Mantenemos una copia del catálogo para no modificar la lista original directamente (Inmutabilidad)
let catalogo = [...catalogoInicial];

// Guardamos las ventas hechas para el informe de caja
let historialVentas = [];

function iniciarMenu() {
  let opcion = '';

  do {
    // Pedimos al usuario que elija una opción del 1 al 6
    opcion = prompt(
      `--- RETROSTOCK: GESTOR DE INVENTARIO ---
1. Ver Catálogo
2. Buscar Producto
3. Registrar una Venta
4. Reponer Stock
5. Informe de Caja
6. Salir
Elige una opción (1-6):`
    );

    switch (opcion) {
      // ----------------------------------------------------
      // OPCIÓN 1: VER CATÁLOGO
      // ----------------------------------------------------
      case '1': {
        const subOpcion = prompt(
          `--- VER CATÁLOGO ---
1. Ver todo el catálogo
2. Filtrar por categoría
3. Solo productos con stock bajo`
        );

        if (subOpcion === '1') {
          // Usamos map() para formatear cada línea del catálogo
          const lineas = catalogo.map(formatearProducto);
          alert(`--- TODO EL CATÁLOGO ---\n\n${lineas.join('\n')}`);
        } else if (subOpcion === '2') {
          const catInput = prompt('Escribe la categoría (ej: RPG, Lucha, Plataformas):');
          if (catInput) {
            // Usamos filter() para obtener solo esa categoría
            const filtrados = catalogo.filter(
              (p) => p.categoria.toLowerCase() === catInput.toLowerCase().trim()
            );
            if (filtrados.length > 0) {
              alert(`--- CATEGORÍA: ${catInput} ---\n\n${filtrados.map(formatearProducto).join('\n')}`);
            } else {
              alert('No hay productos en esa categoría.');
            }
          }
        } else if (subOpcion === '3') {
          // Usamos filter() para sacar solo los de stock bajo (< 3)
          const conStockBajo = catalogo.filter((p) => p.stock < 3);
          if (conStockBajo.length > 0) {
            alert(`--- PRODUCTOS CON STOCK BAJO ---\n\n${conStockBajo.map(formatearProducto).join('\n')}`);
          } else {
            alert('¡Excelente! No hay ningún producto con stock bajo.');
          }
        }
        break;
      }

      // ----------------------------------------------------
      // OPCIÓN 2: BUSCAR PRODUCTO
      // ----------------------------------------------------
      case '2': {
        const criterio = prompt('Introduce el ID o el título del producto:');
        if (criterio) {
          // Usamos find() a través de nuestra función buscarProducto
          const prod = buscarProducto(catalogo, criterio);
          if (prod) {
            alert(`Producto encontrado:\n${formatearProducto(prod)}`);
          } else {
            alert(`No se encontró ningún juego para: "${criterio}"`);
          }
        }
        break;
      }

      // ----------------------------------------------------
      // OPCIÓN 3: REGISTRAR UNA VENTA
      // ----------------------------------------------------
      case '3': {
        const idInput = prompt('ID del producto a vender:');
        const cantInput = prompt('Cantidad a vender:');
        const id = Number(idInput);
        const cantidad = Number(cantInput);

        const prod = catalogo.find((p) => p.id === id);

        if (!prod) {
          alert('Error: Producto no encontrado.');
          break;
        }

        if (isNaN(cantidad) || cantidad <= 0) {
          alert('Error: La cantidad debe ser un número mayor a 0.');
          break;
        }

        try {
          // 1. Calculamos los precios aplicando Tabla A + Tabla B
          const calculo = calcularPrecioVenta(prod.precioBase, prod.estado, cantidad);

          // 2. Actualizamos el catálogo inmutablemente con map() y spread operator
          catalogo = registrarVenta(catalogo, id, cantidad);

          // 3. Registramos la venta en la caja
          historialVentas.push({
            titulo: prod.titulo,
            cantidad,
            totalVenta: calculo.totalVenta
          });

          const prodActualizado = catalogo.find((p) => p.id === id);

          alert(
            `¡Venta registrada con éxito!
-----------------------------------
Juego: ${prod.titulo}
Precio unitario final: ${calculo.precioUnitarioFinal.toFixed(2)} €
Total venta: ${calculo.totalVenta.toFixed(2)} €
Stock restante: ${prodActualizado.stock} unidades${prodActualizado.stock < 3 ? ' (! Stock bajo)' : ''}`
          );
        } catch (err) {
          alert(`Error en la venta: ${err.message}`);
        }
        break;
      }

      // ----------------------------------------------------
      // OPCIÓN 4: REPONER STOCK
      // ----------------------------------------------------
      case '4': {
        const id = Number(prompt('ID del producto a reponer:'));
        const cantidad = Number(prompt('Cantidad a sumar al stock:'));

        const prod = catalogo.find((p) => p.id === id);

        if (!prod || isNaN(cantidad) || cantidad <= 0) {
          alert('Datos erróneos o producto inexistente.');
          break;
        }

        catalogo = reponerStock(catalogo, id, cantidad);
        const prodActualizado = catalogo.find((p) => p.id === id);

        alert(`¡Stock actualizado! Nuevo stock de ${prodActualizado.titulo}: ${prodActualizado.stock}`);
        break;
      }

      // ----------------------------------------------------
      // OPCIÓN 5: INFORME DE CAJA
      // ----------------------------------------------------
      case '5': {
        // Usamos reduce() para sumar el total facturado en la sesión
        const totalFacturado = historialVentas.reduce((acc, v) => acc + v.totalVenta, 0);

        // Usamos reduce() para calcular el valor total del stock que nos queda
        const valorStockRestante = catalogo.reduce((acc, p) => {
          const calculo = calcularPrecioVenta(p.precioBase, p.estado, 1);
          return acc + calculo.precioUnitarioFinal * p.stock;
        }, 0);

        // Usamos some() para comprobar si queda algún producto con stock bajo
        const hayStockBajo = catalogo.some((p) => p.stock < 3);

        alert(
          `--- INFORME DE CAJA DE LA SESIÓN ---
Total facturado: ${totalFacturado.toFixed(2)} €
Operaciones realizadas: ${historialVentas.length}
Valor estimado stock restante: ${valorStockRestante.toFixed(2)} €
Estado stock: ${hayStockBajo ? '⚠️ Hay productos en stock bajo' : '✅ Todo en orden'}`
        );
        break;
      }

      // ----------------------------------------------------
      // OPCIÓN 6 O CANCELAR: SALIR
      // ----------------------------------------------------
      case '6':
      case null:
        alert('Gracias por usar RetroStock. ¡Hasta la próxima!');
        break;

      default:
        alert('Opción no válida. Por favor, selecciona un número del 1 al 6.');
        break;
    }
  } while (opcion !== '6' && opcion !== null);
}

// Arrancamos el programa
iniciarMenu();