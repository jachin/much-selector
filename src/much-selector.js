import {LitElement, html, css} from 'lit-element';

import {MuchOption} from "./much-option.js";

const buildOptionsFromSelecteElement = selectElement => {
  const options = new Map();
  const optionElements = selectElement.querySelectorAll("option");
  optionElements.forEach((optionElement, optionIndex) => {
    const option = new MuchOption(optionElement.getAttribute("value"));
    option.label = optionElement.innerText;
    option.index = optionIndex;
    if (optionElement.hasAttribute("selected")) {
      const optionSelectedValue = optionElement.getAttribute("selected");
      if (optionSelectedValue === "false") {
        option.selected = false;
      } else {
        option.selected = true;
      }
    }
    options.set(option.value, option);
  });
  return options;
}

class MuchSelector extends LitElement {
  static get styles() {
    return css`
      slot {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      options: {type: Map},
    };
  }

  constructor() {
    super();
    this.options = new Map();
  }

  firstUpdated() {
    const selectElements = this.querySelectorAll("select");
    if (selectElements.length > 1) {
      throw "The much-selector element only allows one select element in it's slot."
    }
    selectElements.forEach(selectElement => {
      this.options = buildOptionsFromSelecteElement(selectElement);
    });
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
