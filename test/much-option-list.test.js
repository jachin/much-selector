import { expect } from '@open-wc/testing';
import { MuchOptionList } from '../src/much-option-list.js';
import { MuchOption } from '../src/much-option.js';

const optionList = new MuchOptionList();

const red = new MuchOption('red');
const blue = new MuchOption('blue');
const green = new MuchOption('green');

describe('Much Option List', () => {
  beforeEach(() => {
    optionList.clear();
  });

  it('add an option', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);

    expect(optionList.toArray()).to.deep.equal([red, blue, green]);
  });

  it('do now allow the user to add an option more than once', () => {
    optionList.addStrict(red);
    optionList.addStrict(blue);
    optionList.addStrict(green);
    expect(() => {
      optionList.addStrict(red);
    }).to.throw();
  });

  it('do now allow the user to add an option more than once but be cool about it', () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.add(red);
    expect(optionList.toArray()).to.deep.equal([red, blue, green]);
  });

  it('remove an option by value', () => {
    optionList.addStrict(red);
    optionList.addStrict(blue);
    optionList.addStrict(green);
    optionList.removeByValue('red');

    expect(optionList.toArray()).to.deep.equal([blue, green]);
  });

  it('remove an option', () => {
    optionList.addStrict(red);
    optionList.addStrict(blue);
    optionList.addStrict(green);
    optionList.removeOption(green);

    expect(optionList.toArray()).to.deep.equal([red, blue]);
  });

  it('remove an option in the middle', () => {
    optionList.addStrict(red);
    optionList.addStrict(blue);
    optionList.addStrict(green);
    optionList.removeOption(blue);

    expect(optionList.toArray()).to.deep.equal([red, green]);
  });

  it('no options selected', () => {
    optionList.addStrict(red);
    optionList.addStrict(blue);
    optionList.addStrict(green);

    expect(optionList.selectedOptions).to.deep.equal([]);
  });

  it('select an option by value', () => {
    optionList.addStrict(red);
    optionList.selectByValue('red');

    expect(optionList.selectedOptions).to.deep.equal([red]);
  });

  it('select an option', () => {
    optionList.addStrict(red);
    optionList.selectOption(red);

    expect(optionList.selectedOptions).to.deep.equal([red]);
  });

  it('deselect an option', () => {
    optionList.addStrict(red);
    optionList.selectOption(red);
    optionList.deselectOption(red);

    expect(optionList.selectedOptions).to.deep.equal([]);
  });

  it('select one option', () => {
    optionList.addStrict(red);
    optionList.addStrict(green);
    optionList.selectOneOption(red);
    optionList.selectOneOption(green);

    expect(optionList.selectedOptions).to.deep.equal([green]);
  });
});
