import { asciiFold } from "./ascii-fold.js";

test("asciiFold", () => {
  expect(asciiFold("str")).toBe("str");
  expect(asciiFold("ȷĴ")).toBe("jj");
  expect(asciiFold("JJ")).toBe("jj");
});
