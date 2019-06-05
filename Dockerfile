FROM node:11.3.0-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu
ADD package.json yarn.lock /dejavu/

RUN apk --no-cache update && apk --no-cache add git && rm -rf /var/cache/apk/*

ADD . /dejavu

RUN yarn && yarn cache clean && yarn build:app && rm -rf /dejavu/node_modules && rm -rf /tmp/*

EXPOSE 1358

CMD node server.js
