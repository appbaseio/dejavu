FROM node:11.3.0-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu
ADD package.json yarn.lock /dejavu/

RUN apk --no-cache update && apk --no-cache add make gcc g++ libc-dev libpng-dev automake autoconf libtool bash git openssh && rm -fr /var/cache/apk/*

RUN yarn global add http-server

RUN yarn

ADD . /dejavu

RUN yarn build

RUN cd dist

EXPOSE 1358

CMD ["http-server", "-p 1358"]
