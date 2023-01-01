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

  it("formats multiple statements", () => {
    expect(testFormat(`SELECT 1; SELECT 2`)).toBe(dedent`
      SELECT
        1;
      SELECT
        2
    `);
  });

  it("formats trailing comment", () => {
    expect(testFormat(`SELECT foo -- trailing comment`)).toBe(dedent`
      SELECT
        foo -- trailing comment
    `);
  });

  it("formats separate line comment", () => {
    expect(
      testFormat(`
        SELECT foo
        -- line comment
      `)
    ).toBe(dedent`
      SELECT
        foo
      -- line comment
    `);
  });

  it("formats trailing comment followed by next clause", () => {
    expect(
      testFormat(
        `SELECT foo -- trailing comment
        FROM x`
      )
    ).toBe(dedent`
      SELECT
        foo -- trailing comment
      FROM
        x
    `);
  });

  it("formats inline block-comment", () => {
    expect(testFormat(`SELECT col1 + 3 /* inline */ AS c1`)).toBe(dedent`
      SELECT
        col1 + 3 /* inline */ AS c1
    `);
  });

  it("formats first-line block-comment", () => {
    expect(
      testFormat(
        `/* some comment */
        SELECT 1`
      )
    ).toBe(dedent`
      /* some comment */
      SELECT
        1
    `);
  });

  it("formats first-line line-comment", () => {
    expect(
      testFormat(
        `-- some comment
        SELECT 1`
      )
    ).toBe(dedent`
      -- some comment
      SELECT
        1
    `);
  });
});
