## dejavu - The missing web UI for Elasticsearch

### Chrome Extension Instructions

Chrome extension should be run locally from the ``chrome-extension`` branch or from the github releases.

#### Running Locally

To run the chrome extension directly from github, do the following:

```
git checkout chrome-extension
npm run build_chrome_extension
```

Now go to ``chrome://settings``.

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on "Load unpacked extension..".

![](https://i.imgur.com/tDbvAkf.png)

Select the **dejavu-unpacked** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

``chrome-extension`` branch shares a lot of code with other branches. The main development in dejavu happens via the ``dev`` branch and is then replicated to other branches. There is some code specific to this branch related to chrome's storage APIs and UI that gets pushed here.

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejavu/tree/dev#developing) of the ``dev`` branch.

### License

[MIT License](https://github.com/appbaseio/dejavu/blob/dev/LICENSE.md) (c) 2016, Appbase Inc.

