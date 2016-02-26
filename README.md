DejaVu - a modern ElasticSearch databrowser
====

## Why

## Comparison

|     Features     |                                                    DejaVu                                                    | Elasticsearch-head | Elasticsearch-kopf | Elasticsearch-browser |                                 Kibana                                |
|:----------------:|:------------------------------------------------------------------------------------------------------------:|:------------------:|:------------------:|:---------------------:|:---------------------------------------------------------------------:|
| Installation     | 100% browser javascript. Also available as a chrome extension and an ES plugin.      | Available as ES plugin and you can also run it on any server from filesystem |  Available as ES plugin and you can also run it on any server from filesystem  | Readme is not updated. available as ES plugin. | A server client setup. Uses an ElasticSearch index to store metadata. |
| Modern UI        | Built with React, a live-reload based interface.                                                  | Built with jQuery JavaScript Library v1.6.1 - older UI                   | Built with Angular 1.x               | Built with ExtJs - in UI there is only table view, nothing else                      |                                                                       |
| Browser features | Create, view and edit data from your ElasticSearch index. Auto mapping detection and data filtering support. |             Only data view is available with search feature support. | List of index is available and also you can create new index, but it doesn't show data of that index.                   |  View data of particular type of particular index is available, search feature is also supported.                     |                                                                       |
| Open Source      | Hackable, comes with a MIT license.                                                                          |  Apache License               |       MIT license.             |   Apache License                    |                                                                       |

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
