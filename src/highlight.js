import isString from 'lodash-es/isString';
import isEmpty from 'lodash-es/isEmpty';
import forEach from 'lodash-es/forEach';

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

export { highlight, removeHighlight };
