import forEach from 'lodash-es/forEach';

/**
 * Copies CSS properties from one element to another.
 *
 * @param {object} $from
 * @param {object} $to
 * @param {array} properties
 */
const transferStyles = ($from, $to, properties) => {
  const styles = {};

  properties.forEach(property => {
    styles[property] = $from.style[property];
  });

  forEach(styles, (value, key) => {
    // eslint-disable-next-line no-param-reassign
    $to.style[key] = value;
  });

  return $to;
};

/**
 * Measures the width of a string within a
 * parent element (in pixels).
 *
 * @param {string} str
 * @param {object} $parent
 * @returns {int}
 */
const measureString = (str, $parent) => {
  if (!str) {
    return 0;
  }

  const $test = document.createElement('test');
  $test.style.position = 'absolute';
  $test.style.top = '-99999';
  $test.style.left = '-99999';
  $test.style.width = 'auto';
  $test.style.padding = '0';
  $test.style.whiteSpace = 'pre';

  $test.innerText = str;

  document.querySelector('body').append($test);

  transferStyles($parent, $test, [
    'letterSpacing',
    'fontSize',
    'fontFamily',
    'fontWeight',
    'textTransform',
  ]);

  const rect = $test.getBoundingClientRect();
  const { width } = rect;

  $test.remove();

  return width;
};

export { measureString };
