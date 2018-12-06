FROM node:11.3.0-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu
ADD package.json yarn.lock /dejavu/

RUN apk --no-cache update && apk --no-cache add build-base libpng-dev lcms2-dev bash git && rm -rf /var/cache/apk/*

RUN yarn global add http-server

ADD . /dejavu

RUN yarn && yarn cache clean && yarn build:app && rm -rf /dejavu/node_modules

EXPOSE 1358

CMD ["http-server", "-p 1358", "dist/app/"]
