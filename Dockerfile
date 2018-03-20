FROM node:9.8.0-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu

RUN apk add --no-cache git

RUN yarn global add bower
RUN yarn global add http-server

ADD . /dejavu

RUN yarn
RUN bower install --allow-root
RUN yarn build

EXPOSE 1358
CMD ["http-server", "-p 1358"]
