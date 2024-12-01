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

## Supuestos y decisiones de diseño

***Default actions* para no frenar el desarrollo:**

- ~~Enviada consulta sobre calculo de rendimiento. Al momento se simplificó el cálculo al momento actual, esto es, se compara valor de la tenencia actual respecto al monto total invertido en las órdenes de compra. Recibida la respuesta, se prioriza implementación de envío de órdenes.~~

**Decisiones de diseño para agilizar el desarrollo:**

- No se tuvo en cuenta la validación del id usuario para la consulta de portofolio u orden.
- Se utilizaron tipos primitivos en lugar de `value objects` en entidades simples (por ejemplo: moneda, porcentaje).
- ~~Para simplificar el desarrollo, no se tiene en cuenta un paginado para la consulta de instrumentos~~
