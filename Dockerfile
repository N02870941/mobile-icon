FROM node:8.7

ADD ./src /src

WORKDIR /src

RUN apt-get update     && \
    apt-get -y install    \
    imagemagick zip    && \
    npm install

EXPOSE 80

CMD npm start
