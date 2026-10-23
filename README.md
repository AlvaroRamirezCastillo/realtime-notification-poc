# Realtime notifications POC

Workspace de pnpm con dos proyectos independientes:

- `client-poc`: aplicación Angular con componentes standalone, routing y SCSS.
- `server-poc`: backend con Node.js, TypeScript y Express.

## Requisitos

- Node.js 24.15 o una versión posterior de la rama 24.
- pnpm 11.21.0.

La versión de Node está definida en `.nvmrc`. Consulta la [compatibilidad oficial de Angular](https://angular.dev/reference/versions).

## Desarrollo

Ejecuta los comandos desde la raíz del repositorio:

```sh
pnpm install
pnpm dev
```

- Frontend: <http://localhost:4200>
- Backend: <http://localhost:3000/api/health>

También puedes iniciar cada proyecto por separado:

```sh
pnpm dev:client
pnpm dev:server
```

El servidor se reinicia automáticamente al modificar sus archivos TypeScript. Para personalizar el puerto, copia `server-poc/.env.example` a `server-poc/.env` y cambia `PORT`.

Angular redirige las peticiones a `/api/**` hacia `http://localhost:3000` mediante `client-poc/proxy.conf.json`. Si cambias el puerto del backend, actualiza también ese archivo. Este proxy se aplica únicamente durante el desarrollo; en producción debes configurar el enrutamiento hacia la API.

Con ambos proyectos en ejecución, puedes comprobar la API directamente o a través de Angular:

```sh
curl http://localhost:3000/api/health
curl http://localhost:4200/api/health
```

Ambas peticiones devuelven:

```json
{ "status": "ok", "service": "server-poc" }
```

## Compilación

```sh
pnpm build
```

Los resultados quedan en `client-poc/dist/client-poc/` y `server-poc/dist/`.

Para ejecutar el backend compilado:

```sh
pnpm --filter server-poc start
```

Para ejecutar las pruebas iniciales de Angular:

```sh
pnpm --filter client-poc test --watch=false
```
