import { MuchOptionList } from '../src/much-option-list.js';
import { MuchOption } from '../src/much-option.js';

const optionList = new MuchOptionList();

const red = new MuchOption('red');
const blue = new MuchOption('blue');
const green = new MuchOption('green');

beforeEach(() => {
  optionList.clear();
});

describe('Much Option List', () => {
  it('add an option', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);

    expect(optionList.toArray()).toStrictEqual([red, blue, green]);
  });

  it('do now allow the user to add an option more than once', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    expect(() => {
      optionList.add(red);
    }).toThrow();
  });

  it('remove an option by value', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeByValue('red');

    expect(optionList.toArray()).toStrictEqual([blue, green]);
  });

  it('remove an option', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeOption(green);

    expect(optionList.toArray()).toStrictEqual([red, blue]);
  });

  it('remove an option in the middle', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeOption(blue);

    expect(optionList.toArray()).toStrictEqual([red, green]);
  });

  it('no options selected', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);

    expect(optionList.selectedOptions).toStrictEqual([]);
  });

  it('select an option by value', () => {
    optionList.add(red);
    optionList.selectByValue('red');

    expect(optionList.selectedOptions).toStrictEqual([red]);
  });

  it('select an option', () => {
    optionList.add(red);
    optionList.selectOption(red);

    expect(optionList.selectedOptions).toStrictEqual([red]);
  });

  it('deselect an option', () => {
    optionList.add(red);
    optionList.selectOption(red);
    optionList.deselectOption(red);

    expect(optionList.selectedOptions).toStrictEqual([]);
  });

  it('select one option', () => {
    optionList.add(red);
    optionList.add(green);
    optionList.selectOneOption(red);
    optionList.selectOneOption(green);

    expect(optionList.selectedOptions).toStrictEqual([green]);
  });
});
