class MuchOption {
  constructor(value) {
    this._value = value;
    this._lable = value;
    this._selected = false;
    this._index = null;
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set label(label) {
    this._label = label;
  }

  get label() {
    return this._label;
  }

  set selected(selected) {
    if (typeof selected !== "boolean") {
      throw "MuchOption index must be a boolean";
    }
    this._selected = selected;
  }

  get selected() {
    return this._selected;
  }

  set index(index) {
    if (typeof index !== "number") {
      throw "MuchOption index must be a number";
    }
    this._index = index;
  }

  get index() {
    return this._index;
  }
}

export { MuchOption };
