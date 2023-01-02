import { format } from "./test_utils";
import dedent from "dedent-js";

describe("statement", () => {
  it("formats multiple statements", () => {
    expect(format(`SELECT 1; SELECT 2`)).toBe(dedent`
      SELECT
        1;
      SELECT
        2
    `);
  });
});
