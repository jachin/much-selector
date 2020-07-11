import { MuchOptionList } from "./much-option-list.js";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { MuchOption } from "./much-option.js";

const optionList = new MuchOptionList();

const red = new MuchOption("red");
const blue = new MuchOption("blue");
const green = new MuchOption("green");

beforeEach(() => {
  optionList.clear();
});

describe("Much Option List", () => {
  test("add an option", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);

    expect(optionList.toArray()).toStrictEqual([red, blue, green]);
  });

  test("do now allow the user to add an option more than once", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    expect(() => {
      optionList.add(red);
    }).toThrow();
  });

  test("remove an option by value", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeByValue("red");

    expect(optionList.toArray()).toStrictEqual([blue, green]);
  });

  test("remove an option", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeOption(green);

    expect(optionList.toArray()).toStrictEqual([red, blue]);
  });

  test("remove an option in the middle", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);
    optionList.removeOption(blue);

    expect(optionList.toArray()).toStrictEqual([red, green]);
  });

  test("no options selected", () => {
    optionList.add(red);
    optionList.add(blue);
    optionList.add(green);

    expect(optionList.selectedOptions).toStrictEqual([]);
  });

  test("select an option by value", () => {
    optionList.add(red);
    optionList.selectByValue("red");

    expect(optionList.selectedOptions).toStrictEqual([red]);
  });
});
