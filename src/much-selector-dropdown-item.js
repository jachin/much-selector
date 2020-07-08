import {LitElement, html, css} from 'lit-element';

class MuchSelectorDropdownItem extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
  }

  static get properties() {
    return {
      value: {type: String},
      label: {type: String},
      highlighted: {type: Boolean},
      selected: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.value = null;
    this.label = null;
    this.highlighted = false;
    this.selected = false;

  }

  render() {
    return html`
      <div>
        ${this.label}
      </div>
    `;
  }
}

export { MuchSelectorDropdownItem };
