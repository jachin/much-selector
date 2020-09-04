```js script
import { html } from '@open-wc/demoing-storybook';
import '../much-selector.js';

export default {
  title: 'MuchSelector',
  component: 'much-selector',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# MuchSelector

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add much-selector
```

```js
import 'much-selector/much-selector.js';
```

```js preview-story
export const Simple = () => html`
  <much-selector></much-selector>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <much-selector title="Hello World"></much-selector>
`;
```
