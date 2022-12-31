import { format } from "../src/format";
import dedent from "dedent-js";

describe("format()", () => {
  function testFormat(sql: string) {
    return format(sql, { dialect: "sqlite" });
  }

  it("formats basic SELECT", () => {
    expect(testFormat(`SELECT foo, bar, baz FROM my_table`)).toBe(dedent`
      SELECT
        foo,
        bar,
        baz
      FROM
        my_table
    `);
  });

  it("formats SELECT with aliases", () => {
    expect(testFormat(`SELECT foo AS f FROM my_table t`)).toBe(dedent`
      SELECT
        foo AS f
      FROM
        my_table t
    `);
  });

  it("formats SELECT with binary expressions", () => {
    expect(testFormat(`SELECT 5 + 6/2 - 8`)).toBe(dedent`
      SELECT
        5 + 6 / 2 - 8
    `);
  });

  it("formats SELECT with comments", () => {
    expect(
      testFormat(
        `/* some comment */
        SELECT col1 + 3 /* inline */ AS c1, col2 -- trailing comment
        -- line comment
        FROM db.tbl t`
      )
    ).toBe(dedent`
      /* some comment */
      SELECT
        col1 + 3/* inline */ AS c1,
        col2 -- trailing comment
      -- line comment
      FROM
        db.tbl t
    `);
  });
});
