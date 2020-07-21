import isString from "lodash-es/isString";
import isEmpty from "lodash-es/isEmpty";
import forEach from "lodash-es/forEach";

/**
 * Looks for a text pattern in an element (and it's children) and modifies
 *  the element to put a `<span class"highlight">` tag around the highlighted
 *  text.
 *
 * @param $element
 * @param pattern
 */

const highlight = ($element, pattern) => {
  if (isString(pattern) && isEmpty(pattern)) return;

  const regex = isString(pattern) ? new RegExp(pattern, "i") : pattern;

  const highlightHelper = function (node) {
    let skip = 0;
    if (node.nodeType === node.TEXT_NODE) {
      const pos = node.data.search(regex);
      if (pos >= 0 && node.data.length > 0) {
        const match = node.data.match(regex);
        const spanNode = document.createElement("span");
        spanNode.className = "highlight";
        const middleBit = node.splitText(pos);
        //const endBit = middleBit.splitText(match[0].length);
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
      forEach(node.childNodes, node => {
        highlightHelper(node);
      });
    }
    return skip;
  };

  highlightHelper($element);
};

/**
 * Removes any `<span class"highlight">` in $element's children. This
 *  should reverse any thing that the highlight() function has done.
 *
 * @param $element
 */

const removeHighlight = $element => {
  $element.querySelectorAll("span.highlight").forEach($childElement => {
    $childElement.parent.replaceChild($childElement.firstChild, $childElement);
  });
};

export { highlight, removeHighlight };
