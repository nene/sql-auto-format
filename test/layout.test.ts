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
});
