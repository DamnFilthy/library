FROM node:latest

WORKDIR /express-library

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY src ./src

CMD ["npm", "run", "prod"]

