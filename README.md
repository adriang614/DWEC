# DWEC · Desarrollo Web en Entorno Cliente

Repositorio personal del módulo **Desarrollo Web en Entorno Cliente (DWEC)** del ciclo de **Desarrollo de Aplicaciones Web (DAW), 2º curso**.

**Alumno:** Adrián González Cumbreras
**Curso:** 2026/2027

## Sobre el repositorio

Aquí está todo el trabajo del módulo: ejercicios de clase, baterías de práctica y las prácticas evaluables. El código se desarrolla en JavaScript y se ejecuta con Docker, así que no hace falta instalar nada en el ordenador salvo Docker y Git.

## Contenido

| Carpeta | Descripción |
|---|---|
| `practica1/` | Práctica 1 |
| `practica2/` | Práctica 2: tablero de tareas (kanban) con JavaScript, DOM y almacenamiento |

## Contenidos del módulo

- **UD4 · Objetos y POO:** clases, herencia, polimorfismo, campos privados, `static`, getters y setters, errores propios.
- **UD5 · DOM y eventos:** selección y creación de nodos, delegación de eventos, formularios y validación.
- **UD6 · Asincronía y almacenamiento:** `JSON`, `localStorage`, `async/await` y `fetch`.

## Cómo ejecutar un proyecto

Cada práctica es un proyecto independiente con su propio `compose.yaml`. Desde la carpeta de la práctica:

```bash
# Instalar dependencias (solo la primera vez, con internet)
docker compose run --rm web npm install

# Arrancar la página en http://localhost:5173
docker compose up

# Pasar los tests
docker compose run --rm web npm test

# Revisar y formatear el código
docker compose run --rm web npm run lint
docker compose run --rm web npm run formato
```

## Flujo de trabajo con Git

- `main`: versión estable, lo que se entrega.
- `develop`: rama de integración donde se trabaja a diario.
- `feature/...`: una rama por bloque o apartado, que sale de `develop` y vuelve a ella al terminar.
- Un commit por apartado, con mensajes que empiezan por su identificador (por ejemplo, `A2: Columna con límite WIP`).

## Tecnologías

JavaScript (ES2022+) · HTML · CSS · Vite · Vitest · ESLint · Prettier · Docker · Git y GitHub
