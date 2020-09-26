import isEmpty from 'lodash-es/isEmpty';
import forEach from 'lodash-es/forEach';

const isString = a => typeof a === 'string';

/**
 * Looks for a text pattern in an element (and it's children) and modifies
 *  the element to put a `<span class"highlight">` tag around the highlighted
 *  text.
 *
 * @param $element
 * @param pattern
 * @return Element
 */

const highlight = ($element, pattern) => {
  if (isString(pattern) && isEmpty(pattern)) return $element;

  const regex = isString(pattern) ? new RegExp(pattern, 'i') : pattern;

  const newElement = $element.cloneNode(true);

  const highlightHelper = node => {
    let skip = 0;
    if (node.nodeType === node.TEXT_NODE) {
      const pos = node.data.search(regex);
      if (pos >= 0 && node.data.length > 0) {
        const match = node.data.match(regex);
        const spanNode = document.createElement('span');
        spanNode.className = 'highlight';
        const middleBit = node.splitText(pos);
        middleBit.splitText(match[0].length);
        const middleClone = middleBit.cloneNode(true);
        spanNode.appendChild(middleClone);
        middleBit.parentNode.replaceChild(spanNode, middleBit);
        skip = 1;
      }
    } else if (
      node.nodeType === node.ELEMENT_NODE &&
      node.childNodes &&
      !/(script|style)/i.test(node.tagName)
    ) {
      forEach(node.childNodes, _node => {
        highlightHelper(_node);
      });
    }
    return skip;
  };

  highlightHelper(newElement);
  return newElement;
};

/**
 * Removes any `<span class"highlight">` in $element's children. This
 *  should reverse any thing that the highlight() function has done.
 *
 * @param $element
 */

const removeHighlight = $element => {
  const newElement = $element.cloneNode(true);
  newElement.querySelectorAll('span.highlight').forEach($childElement => {
    $childElement.parent.replaceChild($childElement.firstChild, $childElement);
  });
  return newElement;
};

const parseForNeedle = (needle, haystack) => {
  if (!isString(needle)) {
    throw new TypeError('The needle needs to be a string.');
  }
  if (!isString(haystack)) {
    throw new TypeError('The haystack needs to be a string.');
  }
  if (needle.length < 1) {
    throw new TypeError('The needle needs to have a length of at least 1.');
  }

  if (haystack.length < 1) {
    throw new TypeError('The haystack needs to have a length of at least 1.');
  }
  const needlePositions = [];
  let nextIndex = haystack.indexOf(needle);
  let needleLastIndex = 0;
  while (nextIndex > -1) {
    needlePositions.push(nextIndex);
    needleLastIndex = nextIndex + needle.length;
    nextIndex = haystack.indexOf(needle, needleLastIndex);
  }

  return needlePositions;
};

const parseHaystackIntoTokens = (needlePositions, needle, haystack) => {
  let stack = [];
  const tokens = [];
  let currentToken = '';
  for (let i = 0; i < haystack.length; i += 1) {
    if (needlePositions.includes(i)) {
      // We found the start of the next needle.
      if (currentToken.length > 0) {
        tokens.push({ needle: false, token: currentToken });
      }
      currentToken = haystack[i];
      stack.push(1);
    } else {
      // We found the next piece of something that's in the middle
      // of a needle or the hay.
      currentToken = `${currentToken}${haystack[i]}`;
    }

    if (stack.length > 0) {
      if (stack[stack.length - 1] === needle.length) {
        // We found the end of the needle. Reset the stack and the
        //  current token and save the current token as a needle.
        stack = [];
        tokens.push({ needle: true, token: currentToken });
        currentToken = '';
      } else {
        stack.push(stack[stack.length - 1] + 1);
      }
    }
    if (i === haystack.length - 1 && currentToken.length > 0) {
      // If we are at the end of the haystack and we have a token
      //  left we know it's not part of a needle and we do not want
      //  to lose it
      tokens.push({ needle: false, token: currentToken });
    }
  }

  return tokens;
};

export { highlight, removeHighlight, parseForNeedle, parseHaystackIntoTokens };
