## dejavu - The missing web UI for Elasticsearch

### Chrome Extension Instructions

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

<<<<<<< HEAD
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
=======
### 1. Dejavu Intro

docker run -p 1358:1358 -d appbaseio/dejavu
open http://localhost:1358/live
>>>>>>> b7950fca32ecdfec2165a12207b752aa86f588f2


To run the chrome extension directly from github, do the following:

```
git checkout chrome-extension
npm run build_chrome_extension
```
Now go to ``chrome://settings``.

<<<<<<< HEAD
If you are running your Elasticsearch with docker, you can use flags to pass the custom CORS configuration. See the [docker-compose.yml](https://github.com/appbaseio/dejavu/blob/dev/docker-compose.yml) file for an example.

###### Elasticsearch v2.x

`docker run --name es -d -p 9200:9200 elasticsearch:2 -Des.http.port=9200 -Des.http.cors.allow-origin="http://localhost:1358" -Des.http.cors.enabled=true -Des.http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization -Des.http.cors.allow-credentials=true`

###### Elasticsearch v5.x
=======
You can also run a specific version of **dejavu** by specifying a tag. For example, `v0.13.0` can be used by ``docker run -p 1358:1358 appbaseio/dejavu:v0.13.0``.
>>>>>>> b7950fca32ecdfec2165a12207b752aa86f588f2

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on `Load unpacked extension...`

![](https://i.imgur.com/tDbvAkf.png)

Select the **dejavu-unpacked** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejavu/tree/dev#developing) of the ``dev`` branch.

### License

[MIT License](https://github.com/appbaseio/dejavu/blob/dev/LICENSE.md) (c) 2017, Appbase Inc.

