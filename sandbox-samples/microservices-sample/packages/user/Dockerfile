FROM node:14
WORKDIR /www

COPY package*.json ./
RUN npm install
COPY ./_ .

CMD ["node", "app/start.js" ]