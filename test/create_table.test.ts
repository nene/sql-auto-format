import { format } from "./test_utils";
import dedent from "dedent-js";

describe("create table", () => {
  it("formats basic CREATE TABLE", () => {
    expect(format(`CREATE TABLE my_table (id INT, name VARCHAR(100), price NUMERIC(10, 5))`))
      .toBe(dedent`
        CREATE TABLE my_table (
          id INT,
          name VARCHAR(100),
          price NUMERIC(10, 5)
        )
      `);
  });
});
