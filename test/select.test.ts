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

  it("formats multiple statements", () => {
    expect(format(`SELECT 1; SELECT 2`)).toBe(dedent`
      SELECT
        1;
      SELECT
        2
    `);
  });
});
