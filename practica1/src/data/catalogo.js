// Creamos una lista (array) con todos los juegos iniciales de la tienda.
// Usamos 'export' para poder importar esta lista en otros archivos donde la necesitemos.
export const catalogoInicial = [
  {
    id: 1, // Número único para identificar el juego
    titulo: 'Chrono Trigger', // Nombre del juego
    plataforma: 'SNES', // Consola a la que pertenece
    categoria: 'RPG', // Género para poder filtrar luego
    precioBase: 45, // Precio inicial sin descuentos ni recargos
    estado: 'usado-como-nuevo', // Estado del producto (coincide con la Tabla A)
    stock: 4 // Unidades disponibles en la tienda
  },
  {
    id: 2,
    titulo: 'Streets of Rage 2',
    plataforma: 'MEGA DRIVE',
    categoria: 'Lucha',
    precioBase: 60,
    estado: 'nuevo-precintado',
    stock: 10
  },
  {
    id: 3,
    titulo: 'Super Mario World',
    plataforma: 'SNES',
    categoria: 'Plataformas',
    precioBase: 35,
    estado: 'solo-cartucho',
    stock: 5
  },
  {
    id: 4,
    titulo: 'The Legend of Zelda: Ocarina of Time',
    plataforma: 'N64',
    categoria: 'Aventura',
    precioBase: 50,
    estado: 'usado-caja-danada',
    stock: 2
  },
  {
    id: 5,
    titulo: 'Final Fantasy VII',
    plataforma: 'PS1',
    categoria: 'RPG',
    precioBase: 40,
    estado: 'usado-como-nuevo',
    stock: 8
  },
  {
    id: 6,
    titulo: 'Sonic the Hedgehog 2',
    plataforma: 'MEGA DRIVE',
    categoria: 'Plataformas',
    precioBase: 25,
    estado: 'solo-cartucho',
    stock: 12
  },
  {
    id: 7,
    titulo: 'Metal Gear Solid',
    plataforma: 'PS1',
    categoria: 'Accion',
    precioBase: 55,
    estado: 'nuevo-precintado',
    stock: 3
  },
  {
    id: 8,
    titulo: 'Pokémon Rojo',
    plataforma: 'GAME BOY',
    categoria: 'RPG',
    precioBase: 45,
    estado: 'solo-cartucho',
    stock: 1
  },
  {
    id: 9,
    titulo: 'Tetris',
    plataforma: 'GAME BOY',
    categoria: 'Puzzle',
    precioBase: 15,
    estado: 'usado-caja-danada',
    stock: 6
  },
  {
    id: 10,
    titulo: 'Super Mario Kart',
    plataforma: 'SNES',
    categoria: 'Carreras',
    precioBase: 30,
    estado: 'usado-como-nuevo',
    stock: 4
  },
  {
    id: 11,
    titulo: 'Castlevania: Symphony of the Night',
    plataforma: 'PS1',
    categoria: 'Accion',
    precioBase: 90,
    estado: 'nuevo-precintado',
    stock: 2
  },
  {
    id: 12,
    titulo: 'Donkey Kong Country',
    plataforma: 'SNES',
    categoria: 'Plataformas',
    precioBase: 28,
    estado: 'usado-caja-danada',
    stock: 7
  }
];