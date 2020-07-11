import { MuchOption } from "./much-option.js";

class MuchOptionList {
  constructor() {
    this.options = new Map();
  }

  add(option) {
    if (!(option instanceof MuchOption)) {
      throw "You can only add a MuchOption to a MuchOptionList";
    }

    if (this.options.has(option.value)) {
      throw `You you have already added an option with a value of ${option.value}`;
    }

    this.options.set(option.value, option);
  }

  removeByValue(value) {
    this.options.delete(value);
  }

  removeOption(option) {
    if (!(option instanceof MuchOption)) {
      throw "You can only remove the option if it a MuchOption";
    }

    this.removeByValue(option.value);
  }

  selectByValue(value) {
    const option = this.options.get(value);
    if (!option) {
      throw `Unable to select a option with the value of: ${value}`;
    }
    option.selected = true;
  }

  selectOption(option) {
    if (!(option instanceof MuchOption)) {
      throw "You can only select an option if it is a MuchOption";
    }
    this.selectByValue(option.value);
  }

  deselectOptionByValue(value) {
    const option = this.options.get(value);
    if (!option) {
      throw `Unable to deselect a option with the value of: ${value}`;
    }
    option.selected = false;
  }

  deselectOption(option) {
    if (!(option instanceof MuchOption)) {
      throw "You can only deselect an option if it is a MuchOption";
    }
    this.deselectOptionByValue(option.value);
  }

  selectOneByValue(value) {
    this.selectedOptions.map((selectedOption) => {
      this.deselectOption(selectedOption);
    });
    this.selectByValue(value);
  }

  selectOneOption(option) {
    if (!(option instanceof MuchOption)) {
      throw "You can only select an option if it is a MuchOption";
    }
    this.selectOneByValue(option.value);
  }

  get selectedOptions() {
    const selectedOptions = [];
    this.options.forEach((option) => {
      if (option.selected) {
        selectedOptions.push(option);
      }
    });
    return selectedOptions;
  }

  clear() {
    this.options.clear();
  }

  toArray() {
    const options = [];
    this.options.forEach((option) => {
      options.push(option);
    });
    return options;
  }
}

export { MuchOptionList };
