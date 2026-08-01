FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

CMD npm run start:dev ${APP_NAME}
