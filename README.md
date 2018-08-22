dejavu: The missing Web UI for Elasticsearch
====

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/appbaseio/dejavu/dev/LICENSE.md)  ![React Version](https://img.shields.io/badge/react-v15.6-brightgreen.svg)
 [![Docker Pulls](https://img.shields.io/docker/pulls/appbaseio/dejavu.svg)](https://hub.docker.com/r/appbaseio/dejavu/)

1. **[Dejavu: Intro](#1-dejavu-intro)**
2. **[Features](#2-features)**  
  a. [Easily Connect to Indices](#easily-connect-and-remember-indices)  
  b. [Visual Filters](#visual-filters)  
  c. [Enhanced Filtering with Queries](#enhanced-filtering-with-queries)  
  d. [Modern UI Elements](#modern-ui-elements)  
  e. [Realtime Data Updates](#realtime-data-updates)  
  f. [Import JSON or CSV Data](#import-json-or-csv-data)  
  g. [Build search UIs](#build-search-uis)
3. **[Comparison](#3-comparison-with-other-data-browsers)**
4. **[Roadmap](#4-roadmap)**
5. **[Build Locally / Contributing](#5-build-locally)**
6. **[Get Dejavu](#6-get-dejavu)**  
  a. [Docker Installation](#docker-installation)  
  b. [Hosted Alternatives](#hosted-alternatives)  

---

### 1. Dejavu Intro

**dejavu** is the missing web UI for Elasticsearch. Existing web UIs leave much to be desired or are built with server-side page rendering techniques that make it less responsive and bulkier to run (I am looking at you, Kibana).

We started building dejavu with the goal of creating a modern Web UI (no page reloads, infinite scroll, filtered views, realtime updates, search UI builder) for Elasticsearch with 100% client-side rendering so one can easily run it as a [hosted app on github pages](https://opensource.appbase.io/dejavu/live), [as a chrome extension](https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh) or [as a docker image](https://hub.docker.com/r/appbaseio/dejavu/).

Starting `v1.0`, dejavu is the only Elasticsearch web UI that supports importing data via JSON and CSV files, as well as defining field mappings from the GUI.

Starting with `v1.5`, we support the ability of creating custom headers so you can easily pass different authentication headers, provide enhanced filtering and bulk updating of data via Elasticsearch's Query DSL.

Starting with `v2.0`, we support the ability to build faceted search UIs to test relevancy. You can also export the generated code to a codesandbox. 

---

### 2. Features

#### Easily Connect and Remember Indices

![Connect to an Index](https://i.imgur.com/TksvSAS.gif)

Dejavu allows you to connect to any of the indexes present in your cluster and also caches each connected index locally so they are easily accessible when browsing again.

#### Visual Filters

![Filter Views](https://i.imgur.com/WzS1kTN.gif)

Sort through the data, find information visually, hide irrelevant data and make sense of all the text, numbers and dates. Filters work by identifying data mappings from the Elasticsearch index. If dejavu sees a ``text`` field, it will provide filters for **search**, **has** and **has not** and is also mindful if the data is analyzed. Similarly, a numeric field allows filtering on ranges and a date field allows filtering data by dates.

Moreover, any filtered view can be exported as a JSON or CSV file.

#### Enhanced Filtering with Queries

![Enhanced Filtering with Queries](https://i.imgur.com/HGEEYfu.gif)

Dejavu also supports showing filtered views based on an Elasticsearch query, as well as bulk updating or deleting documents via the query DSL.

#### Modern UI elements

![Pagination](https://i.imgur.com/sEfSPwc.gif)

It's not uncommon to have thousands of documents in your index. Dejavu supports an infinite scroll based UI, pagination is so old school.

Dejavu also supports browsing data from multiple types, updating data either individually or via queries in bulk. Deletions are also supported.

#### Realtime Data Updates

![Realtime data updates](https://i.imgur.com/GrROJqz.gif)

dejavu uses a websockets based API and subscribes for data changes for the current filtered view. For this to work, the Elasticsearch server needs to support a websockets based publish API. Currently, you can take advantage of this feature by hosting your data with appbase.io.


#### Import JSON or CSV Data

![Import JSON or CSV files](https://i.imgur.com/qro6e9Q.gif)

Importer view allows importing CSV or JSON data directly into Elasticsearch through a guided data mappings configuration.

#### Build Search UIs

![Build search UIs](https://i.imgur.com/DbbIyhk.gif)

With Search Sandbox, you can now build visual search UIs, test search relevancy and export code to a search sandbox.

---

### 3. Comparison with other data browsers

|     Features     |                                                    dejavu                                                    | ES-head | ES-kopf | ES-browser |                                 Kibana                                |
|:----------------:|:------------------------------------------------------------------------------------------------------------:|:------------------:|:------------------:|:---------------------:|:---------------------------------------------------------------------:|
| Installation     | Chrome extension, Docker Image, Hosted App.      | Elasticsearch plugin, static page | Elasticsearch plugin, static page  | Elasticsearch plugin (doesn't work with v2.0 and above) | Elasticsearch plugin |
| Modern UI        | Built with React v15.6.0, uses a live-reload interface.                                                  | Built with jQuery v1.6.1, slightly stodgy | Built with Angular 1.x | Built with ExtJs, but a bit stodgy | Built with Node.JS, Hapi, Jade                                                                     |
| Browser features | CRUD with support for data filters. | Read data with support for full-text search. | No data view |  Data view support for a single type | Read view with support for visualizations / charting |
| Data Import/Export | Yes, in JSON and CSV formats. | - | - |  - | Only export is supported, no CSV support. |
| Search Sandbox | Visually build and test search Ux. | - | - |  - | - |
| Open Source      | MIT license                                                                          |  Apache v2.0               |       MIT license             |   Apache v2.0                    |   Apache v2.0                                                                    |

#### Running Locally
Thus started the journey of dejavu, with a goal of 100% client side rendering and usage of modern UI elements (zero page reloads, infinite scrolling, filtered views). It's available as a github hosted page, chrome extension and as a Docker Image.

---

### 4. Roadmap


<s>Here's a rough roadmap of things to come in the version ``1.0.0`` release.</s>

:fireworks: We just hit the 1.0.0 roadmap.

- [x] Battle-testing with different datasets
- [x] Feature support for advanced filtering
<s>Offline detection and reconnection for realtime updates</s>
- [x] Performance improvements while scrolling
- [x] Support for importing and exporting data
- [x] Support for a continuous query view
- [x] Available as a docker image


🍾 We just hit the 2.0.0 release.

- [x] An intuitive data editing experience in tabular mode (v/s JSON edit mode)
- [x] View data types from within the data browser view
- [x] A more streamlined import process
- [x] Refactor codebase to improve hackability (Migrate to React 16+, ES6 syntax)
- [x] Ability to build (and test) search visually


Roadmap beyond v2:

- [ ] Create a test coverage suite
- [ ] Rewrite dejavu browser for high performance when browsing large datasets
- [ ] Support addition of custom analyzers, and updating index settings
- [ ] Make editing of data experience more intuitive (in addition to the raw JSON, show a relevant UI field with validations)
- [ ] Connectors to dashboarding systems for a more flavored visualization experience.

---

### 5. Build Locally

See the **[CONTRIBUTING File](./CONTRIBUTING.md)**

---

### 6. Get Dejavu

#### Docker Installation


docker run -p 1358:1358 -d appbaseio/dejavu
open http://localhost:1358/
```

You can also run a specific version of **dejavu** by specifying a tag. For example, version `1.0.0` can be used by specifying the ``docker run -p 1358:1358 appbaseio/dejavu:1.5.0`` command.


To run the chrome extension directly from github, do the following:

```
git checkout chrome-extension
npm run build_chrome_extension
```
Now go to ``chrome://settings``.

If you are running your Elasticsearch with docker, you can use flags to pass the custom CORS configuration. See the [docker-compose.yml](https://github.com/appbaseio/dejavu/blob/dev/docker-compose.yml) file for an example.

###### Elasticsearch v2.x

`docker run --name es -d -p 9200:9200 elasticsearch:2 -Des.http.port=9200 -Des.http.cors.allow-origin="http://localhost:1358" -Des.http.cors.enabled=true -Des.http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization -Des.http.cors.allow-credentials=true`

###### Elasticsearch v5.x

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on `Load unpacked extension...`

![](https://i.imgur.com/tDbvAkf.png)

Select the **dejavu-unpacked** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejavu/tree/dev#developing) of the ``dev`` branch.

### License

[MIT License](https://github.com/appbaseio/dejavu/blob/dev/LICENSE.md) (c) 2017, Appbase Inc.

