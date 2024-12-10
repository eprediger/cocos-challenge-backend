# cocos-challenge-backend

## Pre-requisitos

```bash
$ npm install
$ cp .env.example .env
```

Editar el archivo `.env` agregando los valores a las variables

## Compilación y ejecución

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Alternativa con Docker

```bash
$ docker build -t cocos/backend:0.1 .

$ docker container run -it --rm --name cocos --memory=1g --cpus=1 --cpuset-cpus=0 -p 3000:3000 -v $(pwd):/api cocos/backend:0.1 /bin/bash

$ cd api
```

## Alternativa con Docker Compose

```bash
$ docker-compose --env-file .env up -d
$ docker-compose exec api /bin/bash
```

- Consulta de logs: `$ docker-compose logs -f api`
- Detener: `$ docker-compose stop`
- Iniciar: `$ docker-compose start`
- Destruir: `$ docker-compose down`

## Documentación

- Swagger: `GET /openapi`

## Supuestos, decisiones de diseño y futuros features.

### Usuarios

- [ ] Tener en cuenta la validación del id usuario para la consulta de portofolio u orden.
- [ ] Cuando exista registro, log in y endpoints segurizados y roles, eliminar el registro

### Calidad de código

- [x] Paginado genérico aplicado a la consulta de instrumentos, reutilizable.
- [ ] Reemplazar tipos primitivos por `value objects` en entidades simples (por ejemplo: moneda, porcentaje) para unificar lógicas de parseo/validación.
- [ ] Mejora búsqueda de texto
	- [ ] Instrumentos a un único `query param` que realicé _full text search_ sobre ticker y nombre.
	- [ ] Que la búsqueda soporte múltiples términos (¿separado por espacios?) en lugar de tomar todo el input como una única cadena

### Performance

- [ ] Analizar tiempos de respuesta agregando índices en la BBDD sobre campos consultados (`instruments.(ticker|name)`)
