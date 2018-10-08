# Dev Setup

## Starting dev server

1. Clone this repo or create your own fork and clone it if you want to send PRs
2. Run `yarn` after cloning the repo to install dependencies
3. Run `yarn start` which starts the `webpack-dev-server` and `webpack-bundle-analyzer`

## Linting and type checking

1. Run `eslint` with `yarn lint`
2. Run typechecking with `yarn flow`

> **Tip**
>
> Install the recommended extensions for your editor

## Troubleshooting

While installing dependencies with `yarn` you might run into an issue with `libpng`. On Fedora linux you would need the `libpng-devel` installed for the dependency to compile:

```sh
sudo dnf install libpng-devel pngquant gcc make libpng12 libpng12-devel
```
