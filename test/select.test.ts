import { format } from "./test_utils";
import dedent from "dedent-js";

describe("select", () => {
  it("formats basic SELECT", () => {
    expect(format(`SELECT foo, bar, baz FROM my_table WHERE x > 10 ORDER BY lname, fname DESC`))
      .toBe(dedent`
      SELECT
        foo,
        bar,
        baz
      FROM
        my_table
      WHERE
        x > 10
      ORDER BY
        lname,
        fname DESC
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
});
