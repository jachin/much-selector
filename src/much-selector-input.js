import { LitElement, html, css } from 'lit-element';

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
    const inputElement = this.shadowRoot.getElementById('text-input');
    inputElement.addEventListener('focus', () => {
      this.dispatchEvent(new Event('input-focus'));
    });

    inputElement.addEventListener('blur', () => {
      this.dispatchEvent(new Event('input-blur'));
    });

    inputElement.addEventListener('keydown', e => {
      const inputValue = e.target.value;
      if (typeof inputValue !== 'string') {
        return;
      }

      this.dispatchEvent(
        new CustomEvent('input-keydown', {
          detail: {
            query: inputValue,
          },
        })
      );
    });

    inputElement.addEventListener('keyup', e => {
      const inputValue = e.target.value;
      if (typeof inputValue !== 'string') {
        return;
      }

      this.dispatchEvent(
        new CustomEvent('input-keyup', {
          detail: {
            query: inputValue,
          },
        })
      );
    });
  }

  render() {
    const selectedValuesHtml = this.selectedValues.map(
      selectedValuePair => html`<span>${selectedValuePair[1]}</span>`
    );

    return html` <div>
      ${selectedValuesHtml}
      <input type="text" id="text-input" />
    </div>`;
  }
}

export { MuchSelectorInput };
