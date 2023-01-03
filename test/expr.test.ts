import { format } from "./test_utils";
import dedent from "dedent-js";

describe("expr", () => {
  it("formats binary expressions", () => {
    expect(format(`SELECT 5 + 6/2 - 8`)).toBe(dedent`
      SELECT
        5 + 6 / 2 - 8
    `);
  });

  it("formats simple function call", () => {
    expect(format(`SELECT pow(10,8)`)).toBe(dedent`
      SELECT
        pow(10, 8)
    `);
  });
});
