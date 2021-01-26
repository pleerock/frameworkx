FROM node:14

WORKDIR /dependencies/category
COPY ./category/package*.json ./
COPY ./category/_ ./
RUN npm install
RUN npm link

WORKDIR /dependencies/post
COPY ./post/package*.json ./
COPY ./post/_ ./
RUN npm install
RUN npm link

WORKDIR /dependencies/user
COPY ./user/package*.json ./
COPY ./user/_ ./
RUN npm install
RUN npm link

WORKDIR /www
COPY ./gateway/package*.json ./
RUN npm i ../dependencies/category
RUN npm i ../dependencies/post
RUN npm i ../dependencies/user
RUN npm install
COPY ./gateway/_ ./

CMD ["node", "index.js" ]