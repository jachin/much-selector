import { LitElement, html, css } from "lit-element";

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
      selectedValues: { type: Array },
    };
  }

  constructor() {
    super();
    this.selectedValues = [];
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
    const selectedValuesHtml = this.selectedValues.map(
      (selectedValuePair) => html`<span>${selectedValuePair[1]}</span>`
    );

    return html` <div>
      ${selectedValuesHtml}
      <input type="text" id="text-input" />
    </div>`;
  }
}

export { MuchSelectorInput };
