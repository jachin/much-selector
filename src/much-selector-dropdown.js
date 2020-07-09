import {LitElement, html, css} from 'lit-element';

class MuchSelectorDropdown extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: absolute;
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
