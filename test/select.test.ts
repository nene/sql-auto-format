import { format } from "./test_utils";
import dedent from "dedent-js";

describe("select", () => {
  it("formats basic SELECT", () => {
    expect(format(`SELECT foo, bar, baz FROM my_table`)).toBe(dedent`
      SELECT
        foo,
        bar,
        baz
      FROM
        my_table
    `);
  });

  it("formats SELECT with aliases", () => {
    expect(format(`SELECT foo AS f FROM my_table t`)).toBe(dedent`
      SELECT
        foo AS f
      FROM
        my_table t
    `);
  });

  it("formats SELECT with binary expressions", () => {
    expect(format(`SELECT 5 + 6/2 - 8`)).toBe(dedent`
      SELECT
        5 + 6 / 2 - 8
    `);
  });

  it("formats SELECT with simple function call", () => {
    expect(format(`SELECT pow(10, 8)`)).toBe(dedent`
      SELECT
        pow(10, 8)
    `);
  });
});
