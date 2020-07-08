import {LitElement, html, css} from 'lit-element';

class MuchSelector extends LitElement {
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
      options: {type: Map},
      selectedOptions: {type: Map},
    };
  }

  constructor() {
    super();
    this.options = new Map();
    this.selectedOptions = new Map();
  }

  render() {
    return html`
      <much-selector-input></much-selector-input>
      <much-selector-dropdown></much-selector-dropdown>
      <slot></slot>
    `;
  }
}

export { MuchSelector }
