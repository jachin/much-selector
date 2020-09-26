import { LitElement, html, css } from 'lit-element';
import Mark from 'mark.js/src/lib/mark';

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
      filterQuery: { type: String, attribute: 'filter-query' },
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
    if (this.filterQuery.length > 0) {
      const labelWithHighlights = this.label.replace(
        this.filterQuery,
        "$`<mark>$&</mark>$'"
      );

      return html`
        <div id="item" class=${this.cssClasses()}>
          ${html(labelWithHighlights)}
        </div>
      `;
    }

    return html`
      <div id="item" class=${this.cssClasses()}>${this.label}</div>
    `;
  }
}

export { MuchSelectorDropdownItem };
