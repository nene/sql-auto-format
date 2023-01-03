import { format } from "./test_utils";
import dedent from "dedent-js";

describe("indent", () => {
  it("indents with 2 spaces by default", () => {
    expect(format(`SELECT (SELECT 1) AS col1`)).toBe(dedent`
      SELECT
        (
          SELECT
            1
        ) AS col1
    `);
  });

  it("indents with 4 spaces when tabWidth:4 specified", () => {
    expect(format(`SELECT (SELECT 1) AS col1`, { tabWidth: 4 })).toBe(dedent`
      SELECT
          (
              SELECT
                  1
          ) AS col1
    `);
  });
});
