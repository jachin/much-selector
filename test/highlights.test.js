import { expect, html, fixture } from '@open-wc/testing';
import {
  highlight,
  removeHighlight,
  parseForNeedle,
  parseHaystackIntoTokens,
} from '../src/highlight.js';

describe('highlight', () => {
  it('highlights a string', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);

    expect(highlight(optionElement, 'Blue')).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight nothing if the pattern is an empty string', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);

    expect(highlight(optionElement, '')).dom.to.equal(
      '<option>Blue Flowers</option>'
    );
  });

  it('highlight is not case sensitive', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);

    expect(highlight(optionElement, 'BLUE')).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight a regular expression', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);

    expect(highlight(optionElement, new RegExp(/Flow/))).dom.to.equal(
      '<option>Blue <span class="highlight">Flow</span>ers</option>'
    );
  });

  it('highlight several options nested in a select', async () => {
    const selectElement = await fixture(
      html`<select>
        <option>Blue Flowers</option>
        <option>Orange Flowers</option>
        <option>Blue Sky</option>
      </select>`
    );

    expect(highlight(selectElement, 'BLUE')).dom.to.equal(
      '<select><option><span class="highlight">Blue</span> Flowers</option><option>Orange Flowers</option><option><span class="highlight">Blue</span> Sky</option></select>'
    );
  });
});

describe('removeHighlight', () => {
  it('option element should be free of highlights.', async () => {
    const selectElement = await fixture(
      html`<select>
        <option><span class="highlight">Blue</span> Flowers</option>
      </select>`
    );

    expect(removeHighlight(selectElement)).dom.to.equal(
      '<select><option>Blue Flowers</option></select>'
    );
  });

  it('remove highlights from several options nested in a select', async () => {
    const selectElement = await fixture(
      html`<select>
        <option><span class="highlight">Blue</span> Flowers</option>
        <option>Orange Flowers</option>
        <option><span class="highlight">Blue</span> Sky</option>
      </select>`
    );

    expect(removeHighlight(selectElement)).dom.to.equal(
      '<select><option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option></select>'
    );
  });
});

describe('parseForNeedle', () => {
  describe('arguments', () => {
    it('needle must be correct', () => {
      expect(() => parseForNeedle(5, 'qwer')).to.throw(TypeError);
      expect(() => parseForNeedle('', 'qwer')).to.throw(TypeError);
    });

    it('haystack must be correct', () => {
      expect(() => parseForNeedle('asdf', 5)).to.throw(TypeError);
      expect(() => parseForNeedle('asdf', '')).to.throw(TypeError);
    });
  });

  it('should find a single needle in a haystack', () => {
    expect(parseForNeedle('b', 'abc')).to.have.ordered.members([1]);
  });
  it('should not find a needle in the haystack if its not there', () => {
    expect(parseForNeedle('d', 'abc')).to.have.ordered.members([]);
  });
  it('should find more than 1 needle', () => {
    expect(parseForNeedle('a', 'ababab')).to.have.ordered.members([0, 2, 4]);
  });
  it('should find the needle even if the case is different', () => {
    expect(parseForNeedle('a', 'ABABAB')).to.have.ordered.members([0, 2, 4]);
  });

  it('should find needles of various lengths', () => {
    expect(parseForNeedle('ab', 'ababab')).to.have.ordered.members([0, 2, 4]);
    expect(parseForNeedle('aba', 'abababa')).to.have.ordered.members([0, 4]);
    expect(
      parseForNeedle('orange', 'red orange white blue orange')
    ).to.have.ordered.members([4, 22]);

    expect(parseForNeedle('aaa', 'aaaaa')).to.have.ordered.members([0]);
  });
});

describe('parseHaystackIntoTokens', () => {
  it('should parse a single token from a string that is only the token', () => {
    expect(parseHaystackIntoTokens([0], 'aaa', 'aaa')).to.eql([
      { needle: true, token: 'aaa' },
    ]);
  });

  it('should parse a string with multiple tokens', () => {
    expect(parseHaystackIntoTokens([0, 4, 8], 'aaa', 'aaa aaa aaa')).to.eql([
      { needle: true, token: 'aaa' },
      { needle: false, token: ' ' },
      { needle: true, token: 'aaa' },
      { needle: false, token: ' ' },
      { needle: true, token: 'aaa' },
    ]);
  });
});
