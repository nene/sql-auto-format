import dedent from "dedent-js";
import { format } from "./test_utils";

describe("comments", () => {
  it("formats trailing comment", () => {
    expect(format(`SELECT foo -- trailing comment`)).toBe(dedent`
      SELECT
        foo -- trailing comment
    `);
  });

  it("formats separate line comment", () => {
    expect(
      format(`
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
      format(
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
    expect(format(`SELECT col1 + 3 /* inline */ AS c1`)).toBe(dedent`
      SELECT
        col1 + 3 /* inline */ AS c1
    `);
  });

  it("formats first-line block-comment", () => {
    expect(
      format(
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
      format(
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
