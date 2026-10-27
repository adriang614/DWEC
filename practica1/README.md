# Práctica 01: RetroStock - Gestor de Inventario y Ventas

Aplicación de consola/interactiva desarrollada en JavaScript para la asignatura **Desarrollo Web en Entorno Cliente (DWEC)** (2º DAW). El objetivo de la aplicación es gestionar el catálogo, el stock y las ventas de una tienda de videojuegos retro aplicando inmutabilidad y buenas prácticas de JS moderno (ES6+).

## 🚀 Cómo ejecutar el proyecto

Para poner en marcha la aplicación mediante el entorno estandarizado con Docker:

1. Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
   git clone <URL-del-repositorio>
   cd retrostock
```

2. Levantar el contenedor Docker:

```bash
   docker compose up -d --build
```

3. Abrir el navegador e ingresar en [http://localhost:5173](http://localhost:5173) para interactuar con la aplicación.

## 🏗️ Justificación del Modelo de Datos y Estructura

### Modelo de Datos (Producto)

El modelo de datos de cada videojuego se ha diseñado como un objeto JS compuesto por las siguientes 7 propiedades:

- **`id`** (Number): Identificador numérico único para localizar el producto rápidamente.
- **`titulo`** (String): Nombre completo del juego.
- **`plataforma`** (String): Consola del juego (SNES, MEGA DRIVE, PS1, N64, GAME BOY).
- **`categoria`** (String): Género principal (RPG, Lucha, Plataformas, Accion, Puzzle, Carreras, Aventura).
- **`precioBase`** (Number): Precio de salida antes de aplicar recargos o descuentos.
- **`estado`** (String): Estado del producto. Solo acepta los 4 valores requeridos para la Tabla A (`nuevo-precintado`, `usado-como-nuevo`, `usado-caja-danada`, `solo-cartucho`).
- **`stock`** (Number): Unidades disponibles en inventario.

El catálogo inicial se ha configurado con 12 juegos variados en `src/data/catalogo.js`, respetando los requisitos de categorías y cobertura de estados. Se ha declarado como un array inmutable (`const`) sobre el que no se aplican mutaciones directas (evitando `push`, `splice` o reasignación de claves).

### Organización de Archivos y Responsabilidades

Se ha optado por una arquitectura modular dentro de `src/` para separar la lógica del programa en ficheros independientes:

- **`src/data/catalogo.js`**: Contiene la definición estática del catálogo inicial de 12 productos.
- **`src/config/negocio.js`**: Define las reglas de negocio puras (Tabla A con porcentajes de estado, Tabla B con descuento por volumen y Tabla C con el umbral de stock bajo).
- **`src/servicios/inventario.js`**: Contiene las funciones operativas del sistema (cálculo de precios, búsquedas, ventas e ingresos inmutables).
- **`src/main.js`**: Gestiona la interfaz del menú de la aplicación (`do...while` y `switch`) y la interacción con el usuario mediante `prompt()` y `alert()`.

## 🐛 Registro de Depuración con Breakpoint

Durante la fase de integración de los módulos surgieron errores de resolución de rutas en el navegador.

- **Bug detectado:** La aplicación devolvía un error HTTP 500 (`ERR_ABORTED`) al intentar importar la configuración de reglas de negocio en la aplicación.
- **Proceso de depuración:** En lugar de rastrear con `console.log`, se abrió el panel de herramientas del navegador (DevTools > pestaña *Sources / Fuentes*) y se colocó un breakpoint en la primera línea del archivo `src/servicios/inventario.js`. Al pausar la ejecución en el breakpoint y revisar las variables globales y el *Call Stack*, se observó que la sentencia `import` estaba utilizando la ruta absoluta del sistema de archivos local (`/home/alu/DWEC/src/...`). En el entorno del contenedor Docker y del servidor de desarrollo de Vite, dicha ruta física no existía dentro del servidor Web.
- **Solución:** Se corrigió la importación dentro de `inventario.js` cambiando la ruta absoluta por una ruta relativa (`../config/negocio.js`), solucionando la carga de módulos.

## 📄 Requisitos Técnicos Implementados

- Uso exclusivo de `const` y `let` (cero uso de `var`).
- Comparaciones estrictas con `===` y `!==`.
- Uso de funciones declaradas, funciones expresadas y funciones flecha (*arrow functions*).
- Parámetros por defecto (`cantidad = 1`) y operador *rest/spread* (`...`).
- Manipulación inmutable de arrays mediante métodos funcionales (`map`, `filter`, `find`, `reduce`, `some`).
- Desestructuración de objetos en el tratamiento de parámetros y retornos.