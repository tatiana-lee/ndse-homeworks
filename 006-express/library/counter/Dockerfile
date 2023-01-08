FROM node:18.10.0

WORKDIR /counter

ARG NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY counter.js ./

CMD ["npm", "run", "dev"]