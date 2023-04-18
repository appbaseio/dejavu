# Dev Setup

## Starting dev server

1. Clone this repo or create your own fork and clone it if you want to send PRs
2. Do the following steps:
   `cd dejavu`
   `git submodule init`
   `git submodule sync`
   `git submodule update --recursive --remote` (We use the `arc` branch for batteries.)
3. Run `yarn` after cloning the repo to install dependencies
4. Run `yarn dev:browser` which starts the `watcher` under `packages/browser` package i.e. `@appbaseio/dejavu-browser`.
5. Run `yarn dev:dejavu` which starts the `webpack-dev-server` on port `1358`

# Antd version

Since this is used in `arc-dashboard` it has to remain compatible with the version. `arc-dashboard` locks the version of antd by only allowing patch level upgrades `~5.0.0` and hence this repo should always have `~5.0.0` as the version.

## Code Formatting

Run `yarn format` to run prettier on `*.js` files.

> **Tip**
>
> Install the recommended extensions for your editor

## Troubleshooting

While installing dependencies with `yarn` you might run into an issue with `libpng`. On Fedora linux you would need the `libpng-devel` installed for the dependency to compile:

```sh
sudo dnf install libpng-devel pngquant gcc make libpng12 libpng12-devel
```
