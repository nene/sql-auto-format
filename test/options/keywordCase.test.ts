import { format } from "../test_utils";
import dedent from "dedent-js";

describe("keywordCase", () => {
  it("keywordCase:preserve keeps keywords as-is", () => {
    expect(format(`select col From tbl WHERE x > 10`, { keywordCase: "preserve" })).toBe(dedent`
      select
        col
      From
        tbl
      WHERE
        x > 10
    `);
  });

  it("keywordCase:upper converts keywords to uppercase", () => {
    expect(format(`select col From tbl WHERE x > 10`, { keywordCase: "upper" })).toBe(dedent`
      SELECT
        col
      FROM
        tbl
      WHERE
        x > 10
    `);
  });

  it("keywordCase:lower converts keywords to lowercase", () => {
    expect(format(`select col From tbl WHERE x > 10`, { keywordCase: "lower" })).toBe(dedent`
      select
        col
      from
        tbl
      where
        x > 10
    `);
  });
});
