import diacritics from "./diacritics.js";

const buildAsciiFoldLookup = diacritics => {
  let i, n, chunk;
  let foreignLetters = "";
  const lookup = {};
  for (const [k, letters] of diacritics) {
    chunk = letters.substring(2, letters.length - 1);
    foreignLetters += chunk;
    for (i = 0, n = chunk.length; i < n; i++) {
      lookup[chunk.charAt(i)] = k;
    }
  }

  return [foreignLetters, lookup];
};

const buildAsciiFold = diacritics => {
  const [foreignLetters, lookup] = buildAsciiFoldLookup(diacritics);

  const regexp = new RegExp(`[${foreignLetters}]`, "g");

  return str =>
    str
      .replace(regexp, function (foreignletter) {
        return lookup[foreignletter];
      })
      .toLowerCase();
};

const asciiFold = buildAsciiFold(diacritics);

export { asciiFold };
