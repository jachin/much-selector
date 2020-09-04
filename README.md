# \<much-selector>

A series of web components that, when used together have many of the features of selectize.

These webcomponents follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Prior Art/Inspiration/Goals

The project draws heavy inspiration from the jquery based [selectize.js](https://selectize.github.io/selectize.js/).

The need for this project is that we want to use selectize.js however we need the over all app to be built in [Elm](https://elm-lang.org/). Elm needs to "own" the DOM and selectize is built in a way that's not compatible with that. 

The goal for this project to achieve near feature parity with selectize using web components. The API will be different so it will not be a drop in replacement but hopefully it will not be too hard to replace one with the other.

Browser support: TBD.

## Installation
```bash
npm i much-selector
```

## Usage
```html
<script type="module">
  import 'much-selector/much-selector.js';
</script>

<much-selector>
  <select>
    <option value="IA">Iowa</option>
    <option value="MN">Minnesota</option>
    <option value="WI">Wisconsin</option>
  </select>
</much-selector>
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Testing with Karma
To run the suite of karma tests, run
```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook
To run a local instance of Storybook for your component, run
```bash
npm run storybook
```

To build a production version of Storybook, run
```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`


## The different web components

In theory, we could do this with a single web component, but this is going to be a large code base so breaking it up into smaller chunks should help different parts be more digestable.

### `<much-selector>`

Responsible for the "public" api.

### `<much-selector-input>`

Responsible for the input field where users will type.

### `<much-selector-dropdown>`

Responsible for the creating the markup for the dropdown, positioning it, and stying it.

### `<much-selector-dropdown-option>`

An individual option in the dropdown.
