## dejavu - The missing web UI for Elasticsearch

### Chrome Extension Instructions

Chrome extension should be run locally from the ``chrome-extension`` branch or from the github releases.

#### Running Locally
=======
Thus started the journey of dejavu, with a goal of 100% client side rendering and usage of modern UI elements (zero page reloads, infinite scrolling, filtered views). It's available as a github hosted page, chrome extension and as a Docker Image.

### Docker - Installation

docker run -p 1358:1358 -d appbaseio/dejavu
open http://localhost:1358

```   

To run the chrome extension directly from github, do the following:

```
git checkout chrome-extension
npm run build_chrome_extension
```
Now go to ``chrome://settings``.
=======

You can also run a specific version of **dejavu** by specifying a tag. For example, `v0.13.0` can be used by ``docker run -p 1358:1358 appbaseio/dejavu:v0.13.0``.

##### CORS

To make sure you enable CORS settings for your ElasticSearch instance, add the following lines in the ES configuration file.

```sh
http.port: 9200
http.cors.allow-origin: "http://127.0.0.1:1358"
http.cors.enabled: true
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true
```

---

### Or  

can also be run via hosted app at https://opensource.appbase.io/dejavu or [installed as a chrome extension](https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh).


For example: If you are using the chrome-extension instead of docker image, the `http.cors.allow-origin` in Elasticsearch.yml file would change accordingly:

```sh
http.port: 9200
http.cors.allow-origin: "chrome-extension://jopjeaiilkcibeohjdmejhoifenbnmlh"
http.cors.enabled: true
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true
```

### Developing

``dev`` branch is the bleeding edge version of dejavu, all new changes go here.

``chrome-extension`` branch is where we make chrome extension related changes.

``gh-pages`` branch is for the hosted app, as well as for the version that runs on dashboard.appbase.io.


#### Local Installation

1. git clone https://github.com/appbaseio/dejavu
2. git checkout master
3. npm install
4. bower install
5. npm start (runs dejavu on http://localhost:1358)

#### Local Build

#### `chrome-extension` branch: Chrome extension

```sh
$ npm run build_chrome_extension
```

#### `gh-pages` branch: Github hosted pages

```sh
$ npm run build_gh_pages
```

#### Contributing

The source code is under the ``live/src`` directory.
You can make pull requests against the ``dev`` branch.

---

## Features

### Filter Views

![Filter Views](http://i.imgur.com/sE90O10.gif)

Sort through the data, find things visually, hide irrelevant data and make sense of all the numbers and dates. Filters work by identifying data mappings from the Elasticsearch index. If dejavu sees a ``string`` field, it will provide filters for **search**, **has** and **has not** and is also mindful if the data is analyzed. Similarly a numeric field allows filtering on ranges and a date field allows filtering data by dates.

dejavu also supports local filters like column sorting and showing a subset of columns.

``To-do``: dejavu doesn't support filtering on advanced data types (like geopoint, parent-child); but it's possible to add those at some point.

### Modern UI elements

![Pagination](http://i.imgur.com/IAX0kLX.gif)

It's not uncommon to have thousands of records in a type. dejavu supports an infinite scroll based UI, pagination is so old school.

dejavu also supports browsing data from multiple types and bulk deletions. It also let's you add new records and update existing records.

### Realtime data updates

![Realtime data updates](http://i.imgur.com/z0Ey4BN.gif)

dejavu uses a websockets based API and subscribes for data changes for the current filtered view. For this to work, the Elasticsearch server needs to support a websockets based publish API. Currently, you can take advantage of this feature by hosting your data with appbase.io.

### Importing JSON or CSV Data

![Importing JSON or CSV files](https://i.imgur.com/B8P5Ag0.png)

This newly supported feature allows importing CSV or JSON data directly into Elasticsearch through a guided data mappings configuration.

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on "Load unpacked extension..".

![](https://i.imgur.com/tDbvAkf.png)

Select the **dejavu-unpacked** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

``chrome-extension`` branch shares a lot of code with other branches. The main development in dejavu happens via the ``dev`` branch and is then replicated to other branches. There is some code specific to this branch related to chrome's storage APIs and UI that gets pushed here.

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejavu/tree/dev#developing) of the ``dev`` branch.

### License

[MIT License](https://github.com/appbaseio/dejavu/blob/dev/LICENSE.md) (c) 2017, Appbase Inc.

