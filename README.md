dejaVu - a modern Elasticsearch databrowser
====

### Chrome App Instructions

Chrome app should be run locally from the ``chrome-extension`` branch or from the github releases.

#### Running Locally

Go to ``chrome://settings``.

![Load unpacked extension](https://i.imgur.com/AK52iP6.png)

Click on "Load unpacked extension..".

![](https://i.imgur.com/uO2WGBW.png)

Select the **dejaVu** directory with the ``chrome-extension`` branch, and you should be good to go!

### Development

``chrome-extension`` branch shares a lot of code with other branches. The main development in dejaVu happens via the ``dev`` branch and is then replicated to other branches. There is some code specific to this branch related to chrome's storage APIs and UI that gets pushed here.

For development instructions, checkout the [developing section](https://github.com/appbaseio/dejaVu/tree/dev#developing) of the ``dev`` branch.

### Publishing

Run the chrome-build.sh, it let's you edit the manifest file and remove unneeded files for publishing (node_modules/, .git/).

```sh
sh chrome-build.sh
```

Test the build locally via unpacked extension and publish it to the chrome store.
