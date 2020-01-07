FROM node:11.3.0-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu

ADD packages/dejavu-main/package.json yarn.lock /dejavu/

RUN apk --no-cache update \
    && apk --no-cache add git \
    && rm -rf /var/cache/apk/*

ADD packages/dejavu-main /dejavu

RUN yarn \
    && yarn cache clean && yarn build:app \
    && rm -rf /dejavu/node_modules \
    && rm -rf /tmp/*

RUN addgroup -S -g 201 dejavu && \
    adduser -S -u 201 -G dejavu dejavu && \
    chown -R dejavu:dejavu /dejavu

USER dejavu

EXPOSE 1358

CMD node server.js
