import { expect } from '@open-wc/testing';
import { asciiFold } from '../src/ascii-fold.js';

describe('asciiFold', () => {
  it('makes fancy strings boring', () => {
    expect(asciiFold('str')).to.equal('str');
    expect(asciiFold('ȷĴ')).to.equal('jj');
    expect(asciiFold('JJ')).to.equal('jj');
  });
});
