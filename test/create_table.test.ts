import { format } from "./test_utils";
import dedent from "dedent-js";

describe("create table", () => {
  it("formats basic CREATE TABLE", () => {
    expect(format(`CREATE TABLE my_table (id INT, fname VARCHAR, lname VARCHAR)`)).toBe(dedent`
      CREATE TABLE my_table (
        id INT,
        fname VARCHAR,
        lname VARCHAR
      )
    `);
  });
});
