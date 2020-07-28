import trim from "./trim.js";
import defaults from "lodash-es/defaults.js";
import forEach from "lodash-es/forEach.js";
import toString from "lodash-es/toString.js";
import escapeRegExp from "lodash-es/escapeRegExp.js";
import diacritics from "./diacritics.js";
import get from "lodash-es/get";
import assignIn from "lodash-es/assign";
import isFunction from "lodash-es/isFunction";
import { asciiFold } from "./ascii-fold";

/**
 * Based on this library.
 * https://github.com/brianreavis/sifter.js
 */

const cmp = function (a, b) {
  if (typeof a === "number" && typeof b === "number") {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }
  a = asciiFold(String(a || ""));
  b = asciiFold(String(b || ""));
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
};

const tokenize = (q, respectWordBoundaries = false, useDiacritics = true) => {
  const query = trim(toString(q)).toLowerCase();
  if (!query || !query.length) return [];

  let i, n, regex;
  const tokens = [];
  const words = query.split(/ +/);

  for (i = 0, n = words.length; i < n; i++) {
    regex = escapeRegExp(words[i]);
    if (useDiacritics) {
      for (const [letter, pattern] of diacritics) {
        regex = regex.replace(new RegExp(letter, "g"), pattern);
      }
    }
    if (respectWordBoundaries) {
      regex = "\\b" + regex;
    }
    tokens.push({
      string: words[i],
      regex: new RegExp(regex, "i"),
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
const prepareSearch = (query, options = null) => {
  if (typeof query === "object") return query;

  options = assignIn({}, options);

  const option_fields = options.fields;
  const option_sort = options.sort;
  const option_sort_empty = options.sort_empty;

  if (option_fields && !Array.isArray(option_fields)) {
    options.fields = [option_fields];
  }
  if (option_sort && !Array.isArray(option_sort)) options.sort = [option_sort];
  if (option_sort_empty && !Array.isArray(option_sort_empty)) {
    options.sort_empty = [option_sort_empty];
  }

  return {
    options: options,
    query: String(query || "").toLowerCase(),
    tokens: tokenize(
      query,
      options.respect_word_boundaries,
      options.diacritics
    ),
    total: 0,
    items: [],
  };
};

const getScoreFunction = (search, options) => {
  search = prepareSearch(search, options);
  const tokens = search.tokens;
  const fields = search.options.fields;
  const token_count = tokens.length;

  const scoreValue = function (value, token) {
    if (!value) return 0;
    const _value = String(value || "");
    const pos = _value.search(token.regex);
    if (pos === -1) return 0;
    let score = token.string.length / _value.length;
    if (pos === 0) score += 0.5;
    return score;
  };

  const makeScoreObject = () => {
    const field_count = fields.length;
    if (!field_count) {
      return function () {
        return 0;
      };
    }
    if (field_count === 1) {
      return (token, data) => scoreValue(get(data, fields[0]), token);
    }
    return (token, data) => {
      let sum = 0;
      for (let i = 0; i < field_count; i++) {
        sum += scoreValue(get(data, fields[i]), token);
      }
      return sum / field_count;
    };
  };

  const scoreObject = makeScoreObject();

  if (!token_count) {
    return () => 0;
  }
  if (token_count === 1) {
    return (data) => scoreObject(tokens[0], data);
  }

  if (search.options.conjunction === "and") {
    return (data) => {
      let score;
      let sum = 0;
      for (let i = 0; i < token_count; i++) {
        score = scoreObject(tokens[i], data);
        if (score <= 0) return 0;
        sum += score;
      }
      return sum / token_count;
    };
  } else {
    return (data) => {
      let sum = 0;
      for (var i = 0; i < token_count; i++) {
        sum += scoreObject(tokens[i], data);
      }
      return sum / token_count;
    };
  }
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
      if (name === "$score") {
        return result.score;
      }

      return get(this.items, `[${result.id}]${name}`);
    };

    // parse options
    const fields = [];
    if (sort) {
      for (let i = 0, n = sort.length; i < n; i++) {
        if (_search.query || sort[i].field !== "$score") {
          fields.push(sort[i]);
        }
      }
    }

    // the "$score" field is implied to be the primary
    // sort field, unless it's manually specified
    if (_search.query) {
      let implicitScore = true;
      for (let i = 0, n = fields.length; i < n; i++) {
        if (fields[i].field === "$score") {
          implicitScore = false;
          break;
        }
      }

      if (implicitScore) {
        fields.unshift({ field: "$score", direction: "desc" });
      }
    } else {
      for (let i = 0, n = fields.length; i < n; i++) {
        if (fields[i].field === "$score") {
          fields.splice(i, 1);
          break;
        }
      }
    }

    const multipliers = [];
    for (let i = 0, n = fields.length; i < n; i++) {
      multipliers.push(fields[i].direction === "desc" ? -1 : 1);
    }

    // build function
    const fieldsCount = fields.length;
    if (!fieldsCount) {
      return null;
    } else if (fieldsCount === 1) {
      const field = fields[0].field;
      const multiplier = multipliers[0];
      return (a, b) => multiplier * cmp(getField(field, a), getField(field, b));
    } else {
      return function (a, b) {
        for (let i = 0; i < fieldsCount; i++) {
          const field = fields[i].field;
          const result =
            multipliers[i] * cmp(getField(field, a), getField(field, b));
          if (result) return result;
        }
        return 0;
      };
    }
  }

  search(query, options) {
    let score;

    const search = prepareSearch(query, options);
    options = search.options;
    query = search.query;

    // generate result scoring function
    const fn_score = isFunction(options.score) || getScoreFunction(search);

    // perform search and sort
    if (query.length) {
      forEach(this.items, (item, id) => {
        score = fn_score(item);
        if (options.filter === false || score > 0) {
          search.items.push({ score: score, id: id });
        }
      });
    } else {
      forEach(this.items, (item, id) => {
        search.items.push({ score: 1, id: id });
      });
    }

    const fn_sort = this.getSortFunction(search, options);
    if (fn_sort) search.items.sort(fn_sort);

    // apply limits
    search.total = search.items.length;
    if (typeof options.limit === "number") {
      search.items = search.items.slice(0, options.limit);
    }

    return search;
  }
}

export { Sifter, tokenize, prepareSearch, getScoreFunction };
