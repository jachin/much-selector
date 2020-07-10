import {LitElement, html, css} from 'lit-element';

class MuchSelectorInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
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

  firstUpdated() {
    const inputElement = this.shadowRoot.getElementById("text-input");
    inputElement.addEventListener("focus", () => {
       this.dispatchEvent(new Event("input-focus"));
    });

    inputElement.addEventListener("blur", () => {
       this.dispatchEvent(new Event("input-blur"));
    });
  }

  render() {
    return html`
      <input type="text" id="text-input"/>
    `;
  }
}

export { MuchSelectorInput };
