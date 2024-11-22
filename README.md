# cocos-challenge-backend

## Pre-requisitos

```bash
$ npm install
```

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

$ docker run -it --rm -p 3000:3000 -v $(pwd):/api cocos/backend:0.1 /bin/bash

$ cd api
```

## Documentación

- Swagger: `GET /openapi`

## Supuestos y decisiones de diseño

***Default actions* para no frenar el desarrollo:**

- ~~Enviada consulta sobre calculo de rendimiento. Al momento se simplificó el cálculo al momento actual, esto es, se compara valor de la tenencia actual respecto al monto total invertido en las órdenes de compra.~~ Recibida la respuesta, se prioriza implementación de envío de órdenes.

**Decisiones de diseño para agilizar el desarrollo:**

- No se tuvo en cuenta la validación del id usuario para la consulta de portofolio u orden.
- Se utilizaron tipos primitivos en lugar de `value objects` en entidades simples (por ejemplo: moneda, porcentaje).
- Para simplificar el desarrollo, no se tiene en cuenta un paginado para la consulta de instrumentos
