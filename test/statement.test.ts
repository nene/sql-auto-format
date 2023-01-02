import { format } from "./test_utils";
import dedent from "dedent-js";

describe("statement", () => {
  it("formats multiple statements", () => {
    expect(format(`SELECT 1; SELECT 2`)).toBe(dedent`
      SELECT
        1;
      SELECT
        2
    `);
  });

  it("formats trailing semicolon", () => {
    expect(format(`SELECT 1;`)).toBe(dedent`
      SELECT
        1;
    `);
  });

  it("preserves 1 empty line between statements", () => {
    expect(format(`SELECT 1;\n\nSELECT 2`)).toBe(dedent`
      SELECT
        1;

      SELECT
        2
    `);
  });

  it("preserves multiple empty line between statements", () => {
    expect(format(`SELECT 1;\n\n\nSELECT 2`)).toBe(dedent`
      SELECT
        1;


      SELECT
        2
    `);
  });

  it("ignores empty lines before first statement", () => {
    expect(format(`\n\n\n\n\nSELECT 1`)).toBe(dedent`
      SELECT
        1
    `);
  });

  it("ignores empty lines after last statement", () => {
    expect(format(`SELECT 1\n\n\n\n\n\n`)).toBe(dedent`
      SELECT
        1
    `);
  });
});
