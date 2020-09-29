import { LitElement, html, css } from 'lit-element';
import { parse } from './highlight.js';

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
      highlighted: { type: Boolean, attribute: 'highlighted' },
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
      this.setAttribute('highlighted', true);
      this.dispatchEvent(
        new CustomEvent('item-highlighted', {
          bubbles: true,
          detail: {
            value: this.value,
          },
        })
      );
    });

    this.addEventListener('mouseout', () => {
      this.removeAttribute('highlighted');
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
      const tokens = parse(this.filterQuery, this.label);

      const makeLabelPart = token => {
        if (token.needle) {
          return html`<mark>${token.token}</mark>`;
        }
        return html`${token.token}`;
      };

      const labelWithHighlights = html`${tokens.map(makeLabelPart)}`;

      return html`
        <div id="item" class=${this.cssClasses()}>${labelWithHighlights}</div>
      `;
    }

    return html`
      <div id="item" class=${this.cssClasses()}>${this.label}</div>
    `;
  }
}

export { MuchSelectorDropdownItem };
