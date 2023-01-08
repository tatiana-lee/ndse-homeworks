FROM node:18.10.0

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY dist ./dist

COPY views ./views

CMD ["npm", "run", "start"]