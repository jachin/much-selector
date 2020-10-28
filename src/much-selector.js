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
      allowMultiple: { type: Boolean, attribute: 'multiple', reflect: true },
    };
  }

  constructor() {
    super();
    this.options = new MuchOptionList();
    this.optionsToDisplay = [];
    this.showDropdown = false;
    this.filterQuery = '';
    this.allowMultiple = false;
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

    // Listen for item highlighted events, there should only be 1 highlighted item at a time.
    this.shadowRoot.addEventListener('item-highlighted', e => {
      this.shadowRoot
        .querySelectorAll('much-selector-dropdown-item[highlighted="true"]')
        .forEach(i => {
          if (i.value !== e.detail.value) {
            i.removeAttribute('highlighted');
          }
        });
    });

    this.inputElement.addEventListener('move-highlighted-down', () => {
      const highlightedItem = this.shadowRoot.querySelector(
        'much-selector-dropdown-item[highlighted="true"]'
      );
      if (highlightedItem) {
        const nextItem = highlightedItem.nextElementSibling;
        if (nextItem) {
          highlightedItem.removeAttribute('highlighted');
          nextItem.setAttribute('highlighted', true);
        }
      } else {
        // If the user hits the down arrow and there is no highlighted item, just select the first one.
        const firstItem = this.shadowRoot.querySelector(
          'much-selector-dropdown-item'
        );
        firstItem.setAttribute('highlighted', true);
      }
    });

    this.inputElement.addEventListener('move-highlighted-up', () => {
      const highlightedItem = this.shadowRoot.querySelector(
        'much-selector-dropdown-item[highlighted="true"]'
      );
      if (highlightedItem) {
        const previousItem = highlightedItem.previousElementSibling;
        if (previousItem) {
          highlightedItem.removeAttribute('highlighted');
          previousItem.setAttribute('highlighted', true);
        }
      } else {
        // If the user hits the up arrow and there is no highlighted item, just select the first one.
        const firstItem = this.shadowRoot.querySelector(
          'much-selector-dropdown-item'
        );
        firstItem.setAttribute('highlighted', true);
      }
    });

    this.inputElement.addEventListener('input-keyup', e => {
      this.optionsToDisplay = this.options.search(e.detail.query);
      this.filterQuery = e.detail.query;
    });
  }

  itemSelectedHandler(event) {
    if (this.allowMultiple) {
      this.options.selectByValue(event.detail.itemValue);
    } else {
      this.options.selectOneByValue(event.detail.itemValue);
    }

    this.inputElement.selectedValues = this.options.selectedOptionValueLabelPairs;
    this.inputElement.clear();
    if (!this.allowMultiple) {
      this.inputElement.blur();
    }

    this.optionsToDisplay = this.options.search('');
    this.filterQuery = '';
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
