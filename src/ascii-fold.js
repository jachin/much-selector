import diacritics from './diacritics.js';

const buildAsciiFoldLookup = _diacritics => {
  let i;
  let n;
  let chunk;

  let foreignLetters = '';
  const lookup = {};
  for (const [k, letters] of _diacritics) {
    chunk = letters.substring(2, letters.length - 1);
    foreignLetters += chunk;
    for (i = 0, n = chunk.length; i < n; i += 1) {
      lookup[chunk.charAt(i)] = k;
    }
  }

  return [foreignLetters, lookup];
};

const buildAsciiFold = _diacritics => {
  const [foreignLetters, lookup] = buildAsciiFoldLookup(_diacritics);

  const regexp = new RegExp(`[${foreignLetters}]`, 'g');

  return str =>
    str
      .replace(regexp, foreignletter => {
        return lookup[foreignletter];
      })
      .toLowerCase();
};

const asciiFold = buildAsciiFold(diacritics);

export { asciiFold };
