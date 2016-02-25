DejaVu - a modern ElasticSearch databrowser
====

## Why

## Comparison

Comparison with existing ElasticSearch browsers.

## Installation Steps

``bin/plugin -install appbaseio/dejaVu``

``Note``: To make sure you enable CORS settings for your ElasticSearch instance, add the following lines in the ES configuration file.

```sh
 http.port: 9200
 http.cors.allow-origin: "http://127.0.0.1:1358"
 http.cors.enabled: true
 http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
 http.cors.allow-credentials: true
```

## Features

## Roadmap
