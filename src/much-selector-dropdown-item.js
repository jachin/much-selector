import { LitElement, html, css } from 'lit-element';

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
        background-color: #add8e6;
      }

      .highlighted {
        background-color: #1e90ff;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: String },
      label: { type: String },
      highlighted: { type: Boolean },
      selected: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = null;
    this.label = null;
    this.highlighted = false;
    this.selected = false;

    this.addEventListener('mouseover', () => {
      this.highlighted = true;
    });

    this.addEventListener('mouseout', () => {
      this.highlighted = false;
    });
  }

  firstUpdated() {
    /**
     * TODO This needs to be a "mousedown" event and not a "click" event. Why is that?
     */
    this.addEventListener('mousedown', () => {
      this.dispatchEvent(
        new CustomEvent('item-selected', {
          bubbles: true,
          composed: true,
          detail: { itemValue: this.value },
        })
      );
    });
  }

  cssClasses() {
    const classes = [];

    if (this.highlighted) {
      classes.push('highlighted');
    }

    if (this.selected) {
      classes.push('selected');
    }

    return classes.join(' ');
  }

  render() {
    return html`
      <div id="item" class=${this.cssClasses()}>${this.label}</div>
    `;
  }
}

export { MuchSelectorDropdownItem };
