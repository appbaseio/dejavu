FROM node:latest
MAINTAINER appbase.io <info@appbase.io>

ENV APP_USER  "app"
ENV APP_DIR "/project"

RUN useradd --user-group --create-home --shell /bin/false $APP_USER

WORKDIR $APP_DIR

RUN npm install -g bower
RUN npm install -g typescript

ADD . $APP_DIR
RUN chown -R $APP_USER:$APP_USER $APP_DIR
USER $APP_USER

RUN npm install
RUN bower install

EXPOSE 1358
CMD ["npm", "start", "--host=0.0.0.0"]