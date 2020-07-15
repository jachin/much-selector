import { highlight, removeHighlight } from "./highlight.js";

describe("highlight", () => {
  test("highlight a string", () => {
    const $optionElement = document.createElement("option");
    $optionElement.innerHTML = "Blue Flowers";
    highlight($optionElement, "Blue");

    expect($optionElement.outerHTML).toBe(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  test("highlight nothing if the pattern is an empty string", () => {
    const $optionElement = document.createElement("option");
    $optionElement.innerHTML = "Blue Flowers";
    highlight($optionElement, "");

    expect($optionElement.outerHTML).toBe("<option>Blue Flowers</option>");
  });

  test("highlight is not case sensitive", () => {
    const $optionElement = document.createElement("option");
    $optionElement.innerHTML = "Blue Flowers";
    highlight($optionElement, "BLUE");

    expect($optionElement.outerHTML).toBe(
      '<option><span class="highlight">Blue</span> Flowers</option>'
    );
  });

  test("highlight a regular expression", () => {
    const $optionElement = document.createElement("option");
    $optionElement.innerHTML = "Blue Flowers";
    highlight($optionElement, new RegExp(/Flow/));

    expect($optionElement.outerHTML).toBe(
      '<option>Blue <span class="highlight">Flow</span>ers</option>'
    );
  });

  test("highlight several options nested in a select", () => {
    const $selectElement = document.createElement("select");
    $selectElement.innerHTML =
      "<option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option>";
    highlight($selectElement, "BLUE");

    expect($selectElement.innerHTML).toBe(
      '<option><span class="highlight">Blue</span> Flowers</option><option>Orange Flowers</option><option><span class="highlight">Blue</span> Sky</option>'
    );
  });
});

describe("removeHighlight", () => {
  test("option element should be free of highlights.", () => {
    const $selectElement = document.createElement("select");

    $selectElement.innerHTML =
      '<option><span class="highlight">Blue</span> Flowers</option>';

    removeHighlight($selectElement);

    expect($selectElement.innerHTML).toBe("<option>Blue Flowers</option>");
  });

  test("remove highlights from several options nested in a select", () => {
    const $selectElement = document.createElement("select");
    $selectElement.innerHTML =
      '<option><span class="highlight">Blue</span> Flowers</option><option>Orange Flowers</option><option><span class="highlight">Blue</span> Sky</option>';
    removeHighlight($selectElement);

    expect($selectElement.innerHTML).toBe(
      "<option>Blue Flowers</option><option>Orange Flowers</option><option>Blue Sky</option>"
    );
  });
});
