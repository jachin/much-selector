import { expect, html, fixture } from '@open-wc/testing';
import { highlight, removeHighlight } from '../src/highlight.js';

describe('highlight', () => {
  it('highlights a string', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);
    highlight(optionElement, 'Blue');

    expect(optionElement).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight nothing if the pattern is an empty string', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);
    highlight(optionElement, '');

    expect(optionElement).dom.to.equal('<option>Blue Flowers</option>');
  });

  it('highlight is not case sensitive', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);
    highlight(optionElement, 'BLUE');

    expect(optionElement).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight a regular expression', async () => {
    const optionElement = await fixture(html`<option>Blue Flowers</option>`);
    highlight(optionElement, new RegExp(/Flow/));

    expect(optionElement).dom.to.equal(
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
    highlight(selectElement, 'BLUE');

    expect(selectElement).dom.to.equal(
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

    removeHighlight(selectElement);

    expect(selectElement).dom.to.equal(
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
    removeHighlight(selectElement);

    expect(selectElement).dom.to.equal(
      '<select><option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option></select>'
    );
  });
});
