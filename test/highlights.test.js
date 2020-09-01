import { highlight, removeHighlight } from '../src/highlight.js';
import { expect, html } from '@open-wc/testing';

describe('highlight', () => {
  it('highlights a string', () => {
    const optionElement = html`<option>Blue Flowers</option>`;
    highlight(optionElement, 'Blue');

    expect(optionElement).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight nothing if the pattern is an empty string', () => {
    const $optionElement = html`<option>Blue Flowers</option>`;
    highlight($optionElement, '');

    expect($optionElement).dom.to.equal('<option>Blue Flowers</option>');
  });

  it('highlight is not case sensitive', () => {
    const $optionElement = html`<option>Blue Flowers</option>`;
    highlight($optionElement, 'BLUE');

    expect($optionElement.outerHTML).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  it('highlight a regular expression', () => {
    const $optionElement = html`<option>Blue Flowers</option>`;
    highlight($optionElement, new RegExp(/Flow/));

    expect($optionElement.outerHTML).dom.to.equal(
      '<option>Blue <span class="highlight">Flow</span>ers</option>'
    );
  });

  it('highlight several options nested in a select', () => {
    const $selectElement = html`<select></select><option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option></select>`;
    highlight($selectElement, 'BLUE');

    expect($selectElement.innerHTML).dom.to.equal(
      '<option><span class="highlight">Blue</span> Flowers</option><option>Orange Flowers</option><option><span class="highlight">Blue</span> Sky</option>'
    );
  });
});

describe('removeHighlight', () => {
  it('option element should be free of highlights.', () => {
    const $selectElement = document.createElement('select');

    $selectElement.innerHTML =
      '<option><span class="highlight">Blue</span> Flowers</option>';

    removeHighlight($selectElement);

    expect($selectElement.innerHTML).toBe('<option>Blue Flowers</option>');
  });

  it('remove highlights from several options nested in a select', () => {
    const $selectElement = document.createElement('select');
    $selectElement.innerHTML =
      '<option><span class="highlight">Blue</span> Flowers</option><option>Orange Flowers</option><option><span class="highlight">Blue</span> Sky</option>';
    removeHighlight($selectElement);

    expect($selectElement.innerHTML).toBe(
      '<option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option>'
    );
  });
});
