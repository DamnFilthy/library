FROM node:latest

WORKDIR /express-library

ARG NODE_ENV=development

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

