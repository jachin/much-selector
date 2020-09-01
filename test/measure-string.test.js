import { measureString } from '../src/measure-string.js';

describe('measureString', () => {
  it('is a number', () => {
    /**
     * We can not really test this much because we're only
     *  using jsdom which does not do any actually rendering
     *  so this just always comes out as 0.
     */

    const $divElement = document.createElement('div');
    expect(typeof measureString('awesome', $divElement)).toBe('number');
  });
});
