DejaVu - a modern ElasticSearch databrowser
====

## Why

## Comparison

|     Features     |                                                    DejaVu                                                    | Elasticsearch-head | Elasticsearch-kopf | Elasticsearch-browser |                                 Kibana                                |
|:----------------:|:------------------------------------------------------------------------------------------------------------:|:------------------:|:------------------:|:---------------------:|:---------------------------------------------------------------------:|
| Installation     | 100% browser javascript. Also available as a chrome extension and an ES plugin.      |                    |                    |                       | A server client setup. Uses an ElasticSearch index to store metadata. |
| Modern UI        | Built with React, a live-reload based interface.                                                  |                    |                    |                       |                                                                       |
| Browser features | Create, view and edit data from your ElasticSearch index. Auto mapping detection and data filtering support. |                    |                    |                       |                                                                       |
| Open Source      | Hackable, comes with a MIT license.                                                                          |                    |                    |                       |                                                                       |

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
