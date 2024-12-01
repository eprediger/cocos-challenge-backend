FROM node:22

RUN npm i -g @nestjs/cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

RUN npm run build

CMD ["npm", "run", "start:dev"]
