dejaVu - a modern Elasticsearch databrowser
====

dejaVu fits the unmet need of being a hackable data browser for Elasticsearch. Existing browsers were either built with a legacy UI and had a lacking user experience or used server side rendering (I am looking at you, Kibana).

So we decided to build our own, with a goal of making it 100% client side and using modern UI elements (no page reloads, infinite scrolling, creating filter views). It's available as a github hosted page, chrome extension and as an Elasticsearch plugin.

### Elasticsearch plugin - Installation

``bin/plugin install appbaseio/dejaVu``

``Note``: To make sure you enable CORS settings for your ElasticSearch instance, add the following lines in the ES configuration file.

```sh
 http.port: 9200
 http.cors.allow-origin: "http://127.0.0.1:1358"
 http.cors.enabled: true
 http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
 http.cors.allow-credentials: true
```

After installing the plugin, 
start elasticsearch service 
```sh
elasticsearch
```
and visit the following URL to access it.

```sh 
http://127.0.0.1:9200/_plugin/dejaVu 
```

``Note:`` If you use Elasticsearch from a different port, the URL would change accordingly.

## Features

### Filter Views

![Filter Views](http://gdurl.com/DKHu)

Sort through the data, find things visually, hide irrelevant data and make sense of all the numbers and dates. Filters work by identifying data mappings from the Elasticsearch index. If dejavu sees a ``string`` field, it will provide filters for **search**, **has** and **has not** and is also mindful if the data is analyzed. Similarly a numeric field allows filtering on ranges and a date field allows filtering data by dates.

dejavu also supports local filters like column sorting and showing a subset of columns.

``To-do``: dejavu doesn't support filtering on advanced data types (like geopoint, parent-child); but it's possible to add those at some point.

### Modern UI elements

![Pagination](http://gdurl.com/P6Ay)

It's not uncommon to have thousands of records in a type. dejavu supports an infinite scroll based UI, pagination is so old school.

dejavu also supports browsing data from multiple types and bulk deletions. It also let's you add new records and update existing records.

### Realtime data updates

![](http://gdurl.com/lBVA)

dejavu uses a websockets based API and subscribes for data changes for the current filtered view. For this to work, the Elasticsearch server needs to support a websockets based publish API. Currently, you can take advantage of this feature by hosting your data with appbase.io.

---

## Comparison with other data browsers

|     Features     |                                                    dejaVu                                                    | Elasticsearch-head | Elasticsearch-kopf | Elasticsearch-browser |                                 Kibana                                |
|:----------------:|:------------------------------------------------------------------------------------------------------------:|:------------------:|:------------------:|:---------------------:|:---------------------------------------------------------------------:|
| Installation     | 100% browser javascript. Also available as a chrome extension and an ES plugin.      | Available as ES plugin and you can also run it on any server from filesystem |  Available as ES plugin and you can also run it on any server from filesystem  | Readme is not updated. available as ES plugin. | A server client setup. Uses an ElasticSearch index to store metadata. |
| Modern UI        | Built with React, a live-reload based interface.                                                  | Built with jQuery JavaScript Library v1.6.1 - older UI                   | Built with Angular 1.x               | Built with ExtJs - in UI there is only table view, nothing else                      | javascript only                                                                      |
| Browser features | Create, view and edit data from your ElasticSearch index. Auto mapping detection and data filtering support. |             Only data view is available with search feature support. | List of index is available and also you can create new index, but it doesn't show data of that index.                   |  View data of particular type of particular index is available, search feature is also supported.                     | Data Discover, data visulizar is available which display the data with search support and also field mapping is available with which you can update field type and other options.  |
| Open Source      | Hackable, comes with a MIT license.                                                                          |  Apache License               |       MIT license.             |   Apache License                    |   Apache License                                                                    |



## Roadmap

Here's a rough roadmap of things to come in the ``v1.0`` release.

* Create a test coverage suite
* Battle-testing with different datasets
* Feature support for advanced filtering
* Offline detection and reconnection for realtime updates
* Performance improvements while scrolling
