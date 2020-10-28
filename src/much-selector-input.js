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
      allowMultiple: { type: Boolean, attribute: 'multiple', reflect: true },
    };
  }

  constructor() {
    super();
    this.selectedValues = [];
    this.allowMultiple = false;
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
      if (e.code === 'Escape') {
        inputElement.blur();
        inputElement.value = '';
        return;
      }
      if (e.code === 'ArrowDown') {
        this.dispatchEvent(new CustomEvent('move-highlighted-down'));
        return;
      }
      if (e.code === 'ArrowUp') {
        this.dispatchEvent(new CustomEvent('move-highlighted-up'));
        return;
      }
      if (e.code === 'Enter') {
        const selectedItem = this.parentNode.querySelector(
          "much-selector-dropdown-item[highlighted='true']"
        );
        if (selectedItem) {
          this.dispatchEvent(
            new CustomEvent('item-selected', {
              bubbles: true,
              composed: true,
              detail: { itemValue: selectedItem.value },
            })
          );
        }
        return;
      }

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

    this.shadowRoot.addEventListener('click', evt => {
      if (evt.target.classList.contains('delete-button')) {
        evt.preventDefault();
        this.dispatchEvent(
          new CustomEvent('item-deselected', {
            bubbles: true,
            composed: true,
            detail: { itemValue: evt.target.dataset.value },
          })
        );
      }
    });
  }

  render() {
    const makeSelectedValueDeleteButton = value =>
      html`<a href="#" class="delete-button" data-value="${value}">x</a>`;

    const selectedValuesHtml = this.selectedValues.map(
      selectedValuePair => html`
        <span>
          ${selectedValuePair[1]}
          ${this.allowMultiple
            ? makeSelectedValueDeleteButton(selectedValuePair[0])
            : html``}
        </span>
      `
    );

    return html` <div>
      ${selectedValuesHtml}
      <input type="text" id="text-input" />
    </div>`;
  }

  clear() {
    const inputElement = this.shadowRoot.querySelector('input');
    inputElement.value = '';
  }

  blur() {
    const inputElement = this.shadowRoot.querySelector('input');
    inputElement.blur();
  }
}

export { MuchSelectorInput };
