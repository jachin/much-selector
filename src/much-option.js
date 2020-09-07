import { html, render } from 'lit-html';

class MuchOption {
  constructor(value) {
    this._value = value;
    this._label = value;
    this._fancyLabel = value;
    this._selected = false;
    this._index = null;
    this._sifterScore = null;
    this._sifterIndex = null;
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set label(label) {
    this._label = label;
    this._fancyLabel = html`<span>${this.label}</span>`;
  }

  set fancyLabel(fancyLabel) {
    this._fancyLabel = fancyLabel;
  }

  get label() {
    return this._label;
  }

  get fancyLabel() {
    return render(this._fancyLabel);
  }

  set selected(selected) {
    if (typeof selected !== 'boolean') {
      throw new Error('MuchOption index must be a boolean');
    }
    this._selected = selected;
  }

  get selected() {
    return this._selected;
  }

  set index(index) {
    if (typeof index !== 'number') {
      throw new Error('MuchOption index must be a number');
    }
    this._index = index;
  }

  get index() {
    return this._index;
  }

  set sifterScore(score) {
    this._sifterScore = score;
  }

  get sifterScore() {
    return this._sifterScore;
  }

  set sifterIndex(index) {
    this._sifterIndex = index;
  }

  get sifterIndex() {
    return this._sifterIndex;
  }

  resetSifterData() {
    this._sifterIndex = null;
    this._sifterScore = null;
  }
}

export { MuchOption };
