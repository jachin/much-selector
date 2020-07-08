import {LitElement, html, css} from 'lit-element';

class MuchSelectorDropdown extends LitElement {
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
      visible: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.visible = false;
  }

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

export { MuchSelectorDropdown };
