import {LitElement, html, css} from 'lit-element';

class MuchSelectorInput extends LitElement {
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
      selectedValues: {type: Map},
    };
  }

  constructor() {
    super();
    this.selectedValues = new Map();
  }

  render() {
    return html`
      <input type="text"></input>
    `;
  }
}

export { MuchSelectorInput };
