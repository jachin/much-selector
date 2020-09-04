import defaults from 'lodash-es/defaults.js';
import forEach from 'lodash-es/forEach.js';
import toString from 'lodash-es/toString.js';
import escapeRegExp from 'lodash-es/escapeRegExp.js';
import get from 'lodash-es/get';
import assignIn from 'lodash-es/assign';
import isFunction from 'lodash-es/isFunction';
import diacritics from './diacritics.js';
import trim from './trim.js';
import { asciiFold } from './ascii-fold.js';

/**
 * Based on this library.
 * https://github.com/brianreavis/sifter.js
 */

const cmp = function (a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }
  const a1 = asciiFold(String(a || ''));
  const b1 = asciiFold(String(b || ''));
  if (a1 > b1) return 1;
  if (b1 > a1) return -1;
  return 0;
};

const tokenize = (q, respectWordBoundaries = false, useDiacritics = true) => {
  const query = trim(toString(q)).toLowerCase();
  if (!query || !query.length) return [];

  let i;
  let n;
  let regex;
  const tokens = [];
  const words = query.split(/ +/);

  for (i = 0, n = words.length; i < n; i += 1) {
    regex = escapeRegExp(words[i]);
    if (useDiacritics) {
      for (const [letter, pattern] of diacritics) {
        regex = regex.replace(new RegExp(letter, 'g'), pattern);
      }
    }
    if (respectWordBoundaries) {
      regex = `\\b${regex}`;
    }
    tokens.push({
      string: words[i],
      regex: new RegExp(regex, 'i'),
    });
  }

  return tokens;
};

/**
 * Parses a search query and returns an object
 * with tokens and fields ready to be populated
 * with results.
 *
 * @param {string} query
 * @param {object} options
 * @returns {object}
 */
const prepareSearch = (query, options_ = null) => {
  if (typeof query === 'object') return query;

  const options = assignIn({}, options_);

  const optionFields = options.fields;
  const optionSort = options.sort;
  const optionSortEmpty = options.sort_empty;

  if (optionFields && !Array.isArray(optionFields)) {
    options.fields = [optionFields];
  }
  if (optionSort && !Array.isArray(optionSort)) options.sort = [optionSort];
  if (optionSortEmpty && !Array.isArray(optionSortEmpty)) {
    options.sort_empty = [optionSortEmpty];
  }

  return {
    options,
    query: String(query || '').toLowerCase(),
    tokens: tokenize(
      query,
      options.respect_word_boundaries,
      options.diacritics
    ),
    total: 0,
    items: [],
  };
};

const getScoreFunction = (search_, options) => {
  const search = prepareSearch(search_, options);
  const { tokens } = search;
  const { fields } = search.options;
  const tokenCount = tokens.length;

  const scoreValue = function (value, token) {
    if (!value) return 0;
    const _value = String(value || '');
    const pos = _value.search(token.regex);
    if (pos === -1) return 0;
    let score = token.string.length / _value.length;
    if (pos === 0) score += 0.5;
    return score;
  };

  const makeScoreObject = () => {
    const fieldCount = fields.length;
    if (!fieldCount) {
      return function () {
        return 0;
      };
    }
    if (fieldCount === 1) {
      return (token, data) => scoreValue(get(data, fields[0]), token);
    }
    return (token, data) => {
      let sum = 0;
      for (let i = 0; i < fieldCount; i += 1) {
        sum += scoreValue(get(data, fields[i]), token);
      }
      return sum / fieldCount;
    };
  };

  const scoreObject = makeScoreObject();

  if (!tokenCount) {
    return () => 0;
  }
  if (tokenCount === 1) {
    return data => scoreObject(tokens[0], data);
  }

  if (search.options.conjunction === 'and') {
    return data => {
      let score;
      let sum = 0;
      for (let i = 0; i < tokenCount; i += 1) {
        score = scoreObject(tokens[i], data);
        if (score <= 0) return 0;
        sum += score;
      }
      return sum / tokenCount;
    };
  }
  return data => {
    let sum = 0;
    for (let i = 0; i < tokenCount; i += 1) {
      sum += scoreObject(tokens[i], data);
    }
    return sum / tokenCount;
  };
};

class Sifter {
  constructor(items, settings) {
    this.items = items;
    this.settings = defaults(settings, { diacritics: true });
  }

  getSortFunction(search, options) {
    const _search = prepareSearch(search, options);
    const sort = (!_search.query && options.sort_empty) || options.sort;
    const getField = (name, result) => {
      if (name === '$score') {
        return result.score;
      }

      return get(this.items, `[${result.id}]${name}`);
    };

    // parse options
    const fields = [];
    if (sort) {
      for (let i = 0, n = sort.length; i < n; i += 1) {
        if (_search.query || sort[i].field !== '$score') {
          fields.push(sort[i]);
        }
      }
    }

    // the "$score" field is implied to be the primary
    // sort field, unless it's manually specified
    if (_search.query) {
      let implicitScore = true;
      for (let i = 0, n = fields.length; i < n; i += 1) {
        if (fields[i].field === '$score') {
          implicitScore = false;
          break;
        }
      }

      if (implicitScore) {
        fields.unshift({ field: '$score', direction: 'desc' });
      }
    } else {
      for (let i = 0, n = fields.length; i < n; i += 1) {
        if (fields[i].field === '$score') {
          fields.splice(i, 1);
          break;
        }
      }
    }

    const multipliers = [];
    for (let i = 0, n = fields.length; i < n; i += 1) {
      multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
    }

    // build function
    const fieldsCount = fields.length;
    if (!fieldsCount) {
      return null;
    }
    if (fieldsCount === 1) {
      const { field } = fields[0];
      const multiplier = multipliers[0];
      return (a, b) => multiplier * cmp(getField(field, a), getField(field, b));
    }
    return function (a, b) {
      for (let i = 0; i < fieldsCount; i += 1) {
        const { field } = fields[i];
        const result =
          multipliers[i] * cmp(getField(field, a), getField(field, b));
        if (result) return result;
      }
      return 0;
    };
  }

  search(query_, options_) {
    let score;

    const search = prepareSearch(query_, options_);
    const { options } = search;
    const { query } = search;

    // generate result scoring function
    const fnScore = isFunction(options.score) || getScoreFunction(search);

    // perform search and sort
    if (query.length) {
      forEach(this.items, (item, id) => {
        score = fnScore(item);
        if (options.filter === false || score > 0) {
          search.items.push({ score, id });
        }
      });
    } else {
      forEach(this.items, (item, id) => {
        search.items.push({ score: 1, id });
      });
    }

    const fnSort = this.getSortFunction(search, options);
    if (fnSort) search.items.sort(fnSort);

    // apply limits
    search.total = search.items.length;
    if (typeof options.limit === 'number') {
      search.items = search.items.slice(0, options.limit);
    }

    return search;
  }
}

export { Sifter, tokenize, prepareSearch, getScoreFunction };
