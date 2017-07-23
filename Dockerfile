FROM node:7-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu

RUN apk add --no-cache git

RUN npm install -g bower
RUN npm install -g http-server

ADD . /dejavu

RUN npm install
RUN bower install --allow-root
RUN npm run build

EXPOSE 1358
CMD ["http-server","_site","-p 1358"]
