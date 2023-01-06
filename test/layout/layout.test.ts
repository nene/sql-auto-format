import { Context } from "../../src/layout/Context";
import { layout } from "../../src/layout/layout";
import { parse } from "../test_utils";

describe("format: layout()", () => {
  function testLayout(sql: string) {
    const cst = parse(sql);
    return layout(new Context(cst, { keywordCase: "preserve", printWidth: 80 }));
  }

  it("computes layout", () => {
    expect(testLayout("SELECT 1, 2, 3")).toEqual([
      {
        layout: "line",
        items: [
          [
            [
              { layout: "line", items: ["SELECT"] },
              {
                layout: "line",
                indent: 1,
                items: [
                  { layout: "line", items: ["1", ","] },
                  { layout: "line", items: ["2", ","] },
                  { layout: "line", items: ["3"] },
                ],
              },
            ],
          ],
        ],
      },
    ]);
  });

  it("computes layout for trailing comment", () => {
    expect(testLayout("SELECT 1 -- comment\nFROM tbl")).toEqual([
      {
        layout: "line",
        items: [
          [
            [
              { layout: "line", items: ["SELECT"] },
              {
                layout: "line",
                indent: 1,
                items: [{ layout: "line", items: ["1"] }],
              },
            ],
            [
              1,
              "-- comment",
              2,
              [
                { layout: "line", items: ["FROM"] },
                { layout: "line", indent: 1, items: ["tbl"] },
              ],
            ],
          ],
        ],
      },
    ]);
  });
});
