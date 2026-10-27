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
- Backend: <http://localhost:3000/api/**>

También puedes iniciar cada proyecto por separado:

```sh
pnpm dev:client
pnpm dev:server
```

