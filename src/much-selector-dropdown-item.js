import {LitElement, html, css} from 'lit-element';

class MuchSelectorDropdownItem extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 0px;
        cursor: pointer;
      }

      #item {
        padding: 8px;
      }

      .selected {
        background-color: #ADD8E6;
      }

      .highlighted {
        background-color: #1E90FF;
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

    this.addEventListener("mouseover", () => {
      this.highlighted = true;
    });

    this.addEventListener("mouseout", () => {
      this.highlighted = false;
    });
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
      <div id="item" class=${this.cssClasses()}>
        ${this.label}
      </div>
    `;
  }
}

export { MuchSelectorDropdownItem };
