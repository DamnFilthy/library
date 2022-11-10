FROM node:latest

WORKDIR /counter

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY src ./src

CMD ["npm", "run", "prod"]
