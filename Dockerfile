FROM node:8.7

ADD  ./src        /app
COPY package.json /app

WORKDIR /app

RUN apt-get update && apt-get -y install imagemagick zip
RUN npm install

EXPOSE 80

CMD node app.js
