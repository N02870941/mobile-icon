FROM node:8.7

ADD  ./src        /app
COPY package.json /app

WORKDIR /app

# Install imagemagic via apt-get

RUN npm install

EXPOSE 80

CMD node index.js
