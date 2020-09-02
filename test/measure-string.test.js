import { measureString } from '../src/measure-string.js';
import { expect, html, fixture } from '@open-wc/testing';

describe('measureString', () => {
  it('is a number', async () => {
    /**
     * We can not really test this much because we're only
     *  using jsdom which does not do any actually rendering
     *  so this just always comes out as 0.
     */

    const divElement = await fixture(html`<div></div>`);
    expect(typeof measureString('awesome', divElement)).to.equal('number');
  });
});
