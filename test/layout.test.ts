import { layout } from "../src/layout";
import { parse } from "./test_utils";

describe("format: layout()", () => {
  function testLayout(sql: string) {
    const cst = parse(sql);
    return layout(cst);
  }

  it("computes layout", () => {
    expect(testLayout("SELECT 1, 2, 3")).toEqual([
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
    ]);
  });

  it("computes layout for trailing comment", () => {
    expect(testLayout("SELECT 1 -- comment\nFROM tbl")).toEqual([
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
          " ",
          "-- comment",
          [
            { layout: "line", items: ["FROM"] },
            { layout: "line", indent: 1, items: ["tbl"] },
          ],
        ],
      ],
    ]);
  });

  // it("computes layout for multiple statements", () => {
  //   expect(testLayout("SELECT 1; SELECT 2")).toEqual([
  //     {
  //       items: [
  //         [
  //           [
  //             { items: ["SELECT"], layout: "line" },
  //             {
  //               indent: 1,
  //               items: [{ items: ["1"], layout: "line" }],
  //               layout: "line",
  //             },
  //           ],
  //         ],
  //         ";",
  //       ],
  //       layout: "line",
  //     },
  //     {
  //       items: [
  //         [
  //           [
  //             { items: ["SELECT"], layout: "line" },
  //             {
  //               indent: 1,
  //               items: [{ items: ["2"], layout: "line" }],
  //               layout: "line",
  //             },
  //           ],
  //         ],
  //       ],
  //       layout: "line",
  //     },
  //   ]);
  // });
});
