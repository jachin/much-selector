import { LitElement, html, css } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import { MuchOption } from './much-option.js';
import { MuchOptionList } from './much-option-list.js';

const buildOptionsFromSelectElement = selectElement => {
  const options = new MuchOptionList();
  const optionElements = selectElement.querySelectorAll('option');
  optionElements.forEach((optionElement, optionIndex) => {
    let value;
    if (optionElement.hasAttribute('value')) {
      value = optionElement.getAttribute('value');
    } else {
      value = optionElement.innerText;
    }
    const option = new MuchOption(value);
    option.label = optionElement.innerText;
    option.index = optionIndex;
    if (optionElement.hasAttribute('selected')) {
      const optionSelectedValue = optionElement.getAttribute('selected');
      option.selected = optionSelectedValue !== 'false';
    }
    options.add(option);
  });
  return options;
};

class MuchSelector extends LitElement {
  static get styles() {
    return css`
      slot {
        display: none;
      }

      #dropdown {
        display: none;
      }

      #dropdown[visible] {
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      options: { type: MuchOptionList },
      optionsToDisplay: { type: Array },
      showDropdown: { type: Boolean, attribute: false },
      filterQuery: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.options = new MuchOptionList();
    this.optionsToDisplay = [];
    this.showDropdown = false;
  }

  firstUpdated() {
    const selectElements = this.querySelectorAll('select');
    if (selectElements.length > 1) {
      throw new Error(
        "The much-selector element only allows one select element in it's slot."
      );
    }
    selectElements.forEach(selectElement => {
      this.options = buildOptionsFromSelectElement(selectElement);
      this.optionsToDisplay = this.options.toArray();
    });

    this.inputElement = this.shadowRoot.getElementById('input');
    this.inputElement.selectedValues = this.options.selectedOptionValueLabelPairs;

    this.dropdownElement = this.shadowRoot.getElementById('dropdown');

    this.inputElement.addEventListener('input-focus', () => {
      this.showDropdown = true;
    });

    this.inputElement.addEventListener('input-blur', () => {
      this.showDropdown = false;
    });

    this.addEventListener('item-selected', this.itemSelectedHandler);

    this.inputElement.addEventListener('input-keyup', e => {
      this.optionsToDisplay = this.options.search(e.detail.query);
      this.filterQuery = e.detail.query;
    });
  }

  itemSelectedHandler(event) {
    this.options.selectOneByValue(event.detail.itemValue);
    this.inputElement.selectedValues = this.options.selectedOptionValueLabelPairs;
  }

  render() {
    const optionTemplates = this.optionsToDisplay.map(option => {
      return html`<much-selector-dropdown-item
        value="${option.value}"
        label="${option.label}"
        ?selected=${option.selected}
        filter-query="${this.filterQuery}"
      ></much-selector-dropdown-item>`;
    });

    const rect = this.getBoundingClientRect();

    const dropdownStyles = { top: `${rect.bottom}.px`, left: `${rect.left}` };

    return html`
      <much-selector-input id="input"></much-selector-input>
      <much-selector-dropdown
        id="dropdown"
        ?visible=${this.showDropdown}
        style=${styleMap(dropdownStyles)}
      >
        ${optionTemplates}
      </much-selector-dropdown>
      <slot></slot>
    `;
  }
}

export { MuchSelector };
