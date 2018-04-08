FROM node:9.10.1-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /dejavu
ADD package.json bower.json yarn.lock /dejavu/

RUN apk --update add git && yarn global add bower && yarn global add http-server

RUN yarn && bower install --allow-root

ADD . /dejavu

RUN yarn build

EXPOSE 1358
CMD ["http-server", "-p 1358"]
