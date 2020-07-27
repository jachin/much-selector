# Much Selector

A series of web components that, when used together have many of the features of selectize.


## Prior Art/Inspiration/Goals

The project draws heavy inspiration from the jquery based [selectize.js](https://selectize.github.io/selectize.js/).

The need for this project is that we want to use selectize.js however we need the over all app to be built in [Elm](https://elm-lang.org/). Elm needs to "own" the DOM and selectize is built in a way that's not compatible with that. 

The goal for this project to achieve near feature parity with selectize using web components. The API will be different so it will not be a drop in replacement but hopefully it will not be too hard to replace one with the other.

Browser support: TBD.

## API

```
<much-selector>
  <select>
    <option value="IA">Iowa</option>
    <option value="MN">Minnesota</option>
    <option value="WI">Wisconsin</option>
  </select>
</much-selector>
```

## The different web components

In theory we could do this with a single web component, but this is going to be a large code base so breaking it up into smaller chunks should help different parts be more digestable.

### `<much-selector>`

Responsible for the "public" api.

### `<much-selector-input>`

Responsible for the input field where users will type.

### `<much-selector-dropdown>`

Responsible for the creating the markup for the dropdown, positioning it, and stying it.

### `<much-selector-dropdown-option>`

An individual option in the dropdown.
