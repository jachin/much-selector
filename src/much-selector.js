import { LitElement, html, css } from "lit-element";
import { styleMap } from "lit-html/directives/style-map";

import { MuchOption } from "./much-option.js";

const buildOptionsFromSelecteElement = (selectElement) => {
  const options = new Map();
  const optionElements = selectElement.querySelectorAll("option");
  optionElements.forEach((optionElement, optionIndex) => {
    const option = new MuchOption(optionElement.getAttribute("value"));
    option.label = optionElement.innerText;
    option.index = optionIndex;
    if (optionElement.hasAttribute("selected")) {
      const optionSelectedValue = optionElement.getAttribute("selected");
      option.selected = optionSelectedValue !== "false";
    }
    options.set(option.value, option);
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
      options: { type: Map },
      showDropdown: { type: Boolean, attribute: false },
    };
  }

  constructor() {
    super();
    this.options = new Map();
    this.showDropdown = false;
  }

  firstUpdated() {
    const selectElements = this.querySelectorAll("select");
    if (selectElements.length > 1) {
      throw "The much-selector element only allows one select element in it's slot.";
    }
    selectElements.forEach((selectElement) => {
      this.options = buildOptionsFromSelecteElement(selectElement);
    });

    this.inputElement = this.shadowRoot.getElementById("input");
    this.dropdownElement = this.shadowRoot.getElementById("dropdown");

    this.inputElement.addEventListener("input-focus", () => {
      console.log("<much-selector> input-focus");
      this.showDropdown = true;
    });

    this.inputElement.addEventListener("input-blur", () => {
      console.log("<much-selector> input-blur");
      this.showDropdown = false;
    });

    this.addEventListener("item-selected", (e) => {
      const selectedOption = this.options.get(e.detail.itemValue);
      selectedOption.selected = true;
      this.options.set(e.detail.itemValue, selectedOption);
    });
  }

  render() {
    const optionTemplates = [];
    this.options.forEach((option) => {
      optionTemplates.push(html`
        <much-selector-dropdown-item
          value="${option.value}"
          label="${option.label}"
          ?selected=${option.selected}>
        </much-selector-dropdown-item`);
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
