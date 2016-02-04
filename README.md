Appbase data browser
====

### Installation (for appbase branch)

You need Gulp installed globally:

```sh
$ npm install -g gulp
```

```sh
$ npm install 
$ bower install
$ gulp watch
- open http://127.0.0.1:1358
```

This will start a local webserver running on port 1358 serving dejaVu - data browser

### Elasticsearch config

To enable CORS
```sh
 http.port: 9200
 http.cors.allow-origin: "http://127.0.0.1:1358"
 http.cors.enabled: true
 http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
 http.cors.allow-credentials: true
```