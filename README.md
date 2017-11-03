## dejavu - The missing web UI for Elasticsearch

### Chrome Extension Instructions

Chrome extension should be run locally from the ``chrome-extension`` branch or from the github releases.

#### Running Locally
Thus started the journey of dejavu, with a goal of 100% client side rendering and usage of modern UI elements (zero page reloads, infinite scrolling, filtered views). It's available as a github hosted page, chrome extension and as a Docker Image.

### 1. Dejavu Intro

docker run -p 1358:1358 -d appbaseio/dejavu
open http://localhost:1358/live


To run the chrome extension directly from github, do the following:

```
git checkout chrome-extension
npm run build_chrome_extension
```
Now go to ``chrome://settings``.

You can also run a specific version of **dejavu** by specifying a tag. For example, `v0.13.0` can be used by ``docker run -p 1358:1358 appbaseio/dejavu:v0.13.0``.

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on `Load unpacked extension...`

![](https://i.imgur.com/tDbvAkf.png)

Select the **dejavu-unpacked** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejavu/tree/dev#developing) of the ``dev`` branch.

### License

[MIT License](https://github.com/appbaseio/dejavu/blob/dev/LICENSE.md) (c) 2017, Appbase Inc.

