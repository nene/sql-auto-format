import { format } from "./test_utils";
import dedent from "dedent-js";

describe("select", () => {
  it("formats basic SELECT", () => {
    expect(
      format(`SELECT foo, bar, baz FROM my_table WHERE x > 10 ORDER BY lname, fname DESC LIMIT 25`)
    ).toBe(dedent`
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
      LIMIT
        25
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

  it("formats basic JOIN", () => {
    expect(format(`SELECT * FROM table1 LEFT JOIN table2 ON table1.id=table2.user_id`)).toBe(dedent`
      SELECT
        *
      FROM
        table1
        LEFT JOIN table2 ON table1.id = table2.user_id
    `);
  });

  it("formats sub-select", () => {
    expect(format(`SELECT name IN (SELECT fname FROM person_names)`)).toBe(dedent`
      SELECT
        name IN (
          SELECT
            fname
          FROM
            person_names
        )
    `);
  });
});
