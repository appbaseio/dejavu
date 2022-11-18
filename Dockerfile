FROM node:lts-alpine3.16
LABEL maintainer="reactivesearch.io" email="info@reactivesearch.io"

WORKDIR /dejavu

ADD package.json yarn.lock /dejavu/

RUN apk --no-cache update \
    && apk --no-cache add git \
    && rm -rf /var/cache/apk/*

ADD . /dejavu

RUN yarn \
    && yarn cache clean && yarn build:dejavu:app \
    && rm -rf /dejavu/node_modules \
    && rm -rf /tmp/*

RUN addgroup -S -g 201 dejavu && \
    adduser -S -u 201 -G dejavu dejavu && \
    chown -R dejavu:dejavu /dejavu

USER dejavu

EXPOSE 1358

CMD node packages/dejavu-main/server.js
