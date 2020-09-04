import { MuchOption } from './much-option.js';
import { Sifter } from './sifter.js';

class MuchOptionList {
  constructor() {
    this.options = new Map();
  }

  add(option) {
    if (!this.options.has(option.value)) {
      this.addStrict(option);
    } else {
      console.warn(`There is already a value of: ${option.value}`);
    }
  }

  addStrict(option) {
    if (!(option instanceof MuchOption)) {
      throw new Error('You can only add a MuchOption to a MuchOptionList');
    }

    if (this.options.has(option.value)) {
      throw new Error(
        `You you have already added an option with a value of ${option.value}`
      );
    }

    this.options.set(option.value, option);
  }

  removeByValue(value) {
    this.options.delete(value);
  }

  removeOption(option) {
    if (!(option instanceof MuchOption)) {
      throw new Error('You can only remove the option if it a MuchOption');
    }

    this.removeByValue(option.value);
  }

  selectByValue(value) {
    const option = this.options.get(value);
    if (!option) {
      throw new Error(`Unable to select a option with the value of: ${value}`);
    }
    option.selected = true;
  }

  selectOption(option) {
    if (!(option instanceof MuchOption)) {
      throw new Error('You can only select an option if it is a MuchOption');
    }
    this.selectByValue(option.value);
  }

  deselectOptionByValue(value) {
    const option = this.options.get(value);
    if (!option) {
      throw new Error(
        `Unable to deselect a option with the value of: ${value}`
      );
    }
    option.selected = false;
  }

  deselectOption(option) {
    if (!(option instanceof MuchOption)) {
      throw new Error('You can only deselect an option if it is a MuchOption');
    }
    this.deselectOptionByValue(option.value);
  }

  selectOneByValue(value) {
    this.selectedOptions.forEach(selectedOption => {
      this.deselectOption(selectedOption);
    });
    this.selectByValue(value);
  }

  selectOneOption(option) {
    if (!(option instanceof MuchOption)) {
      throw new Error('You can only select an option if it is a MuchOption');
    }
    this.selectOneByValue(option.value);
  }

  get selectedOptions() {
    const selectedOptions = [];
    this.options.forEach(option => {
      if (option.selected) {
        selectedOptions.push(option);
      }
    });
    return selectedOptions;
  }

  // TODO make this "pair" thing a type.
  get selectedOptionValueLabelPairs() {
    const selectedValueLabelPairs = [];
    this.selectedOptions.forEach(selectedOption => {
      selectedValueLabelPairs.push([
        selectedOption.value,
        selectedOption.label,
      ]);
    });
    return selectedValueLabelPairs;
  }

  clear() {
    this.options.clear();
  }

  toArray() {
    const options = [];
    this.options.forEach(option => {
      options.push(option);
    });
    return options;
  }

  search(query) {
    console.log('search - query', query);
    // Reset all the old sifter indexes and scores
    this.options.forEach(option => option.resetSifterData());
    const arrayOfOptions = this.toArray();
    const sifter = new Sifter(arrayOfOptions);
    const results = sifter.search(query, { fields: 'label' });
    results.items.forEach((resultsItem, resultIndex) => {
      const option = arrayOfOptions[resultsItem.id];
      option.sifterIndex = resultIndex;
      option.sifterScore = resultsItem.score;

      console.log('option', option);
      console.log('resultIndex', resultIndex);
      console.log('resultsItem', resultsItem);

      // TODO Do something with highlight here
    });

    // Filter out all the options that don't match the search string at all.
    const filteredOptions = arrayOfOptions.filter(
      o => o.sifterIndex !== null && o.sifterIndex !== undefined
    );

    // Sort the options by the index assigned to them by Sifter
    return filteredOptions.sort((a, b) => {
      if (a.sifterIndex > b.sifterIndex) {
        return 1;
      }
      if (a.sifterIndex < b.sifterIndex) {
        return -1;
      }
      return 0;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  debugOptions(options) {
    const output = [];
    options.forEach(o =>
      output.push(`${o.value} ${o.sifterScore} ${o.sifterIndex}`)
    );
    return output.join('\n');
  }
}

export { MuchOptionList };
