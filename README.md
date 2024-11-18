# cocos-challenge-backend

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Alternative through Docker

```bash
$ docker build -t cocos/backend:0.1 .

$ docker run -it --rm -p 3000:3000 -v $(pwd):/api cocos/backend:0.1 /bin/bash

$ cd api
```

## Documentation

`GET /openapi`
