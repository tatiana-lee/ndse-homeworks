FROM node:latest

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY middleware ./middleware

COPY models ./models

COPY public ./public

COPY routes ./routes

COPY views ./views

COPY index.js ./

CMD ["npm", "run", "start"]