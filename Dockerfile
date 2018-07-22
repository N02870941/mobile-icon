FROM node:8.7

ADD ./src /app

WORKDIR /app

RUN apt-get update     && \
    apt-get -y install    \
    imagemagick zip    && \
    npm install

EXPOSE 80

CMD node app.js
