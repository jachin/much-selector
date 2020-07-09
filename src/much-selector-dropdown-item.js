import {LitElement, html, css} from 'lit-element';

class MuchSelectorDropdownItem extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
      }

      .selected {
        background-color: #ADD8E6;
      }
    `;
  }

  static get properties() {
    return {
      value: {type: String},
      label: {type: String},
      highlighted: {type: Boolean},
      selected: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.value = null;
    this.label = null;
    this.highlighted = false;
    this.selected = false;
  }

  cssClasses() {
    const classes = [];

    if (this.highlighted) {
      classes.push("highlighted");
    }

    if (this.selected) {
      classes.push("selected");
    }

    return classes.join(" ");
  }

  render() {
    return html`
      <div class=${this.cssClasses()}>
        ${this.label}
      </div>
    `;
  }
}

export { MuchSelectorDropdownItem };
