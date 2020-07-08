# Much Selector

A series of web component that, when used together have many of the features of selectize.

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
