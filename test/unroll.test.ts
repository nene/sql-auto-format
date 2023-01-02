import { unroll } from "../src/unroll";
import { Line } from "../src/layout";

describe("format: unroll()", () => {
  it("converts line to one-item array", () => {
    const line: Line = { layout: "line", items: ["1", " ", "2"] };
    expect(unroll(line)).toEqual([line]);
  });

  it("line inside a line is just a line", () => {
    expect(unroll({ layout: "line", items: [{ layout: "line", items: ["1", " ", "2"] }] })).toEqual(
      [{ layout: "line", items: ["1", " ", "2"] }]
    );
  });

  it("two lines inside one line are two lines", () => {
    expect(
      unroll({
        layout: "line",
        items: [
          { layout: "line", items: ["hello"] },
          { layout: "line", items: ["world"] },
        ],
      })
    ).toEqual([
      { layout: "line", items: ["hello"] },
      { layout: "line", items: ["world"] },
    ]);
  });

  it("two lines are two lines", () => {
    const twoLines: Line[] = [
      { layout: "line", items: ["hello"] },
      { layout: "line", items: ["world"] },
    ];
    expect(unroll(twoLines)).toEqual(twoLines);
  });

  it("two lines, with one containing another two lines, are three lines", () => {
    const twoLines: Line[] = [
      { layout: "line", items: ["hello"] },
      {
        layout: "line",
        items: [
          { layout: "line", items: ["my"] },
          { layout: "line", items: ["world"] },
        ],
      },
    ];
    expect(unroll(twoLines)).toEqual([
      { layout: "line", items: ["hello"] },
      { layout: "line", items: ["my"] },
      { layout: "line", items: ["world"] },
    ]);
  });

  it("line nested inside multiple arrays is just one line in array", () => {
    expect(unroll([[[{ layout: "line", items: ["hello"] }]]])).toEqual([
      { layout: "line", items: ["hello"] },
    ]);
  });

  it("unindented line inside indented line inherits the indent", () => {
    const line: Line = {
      layout: "line",
      indent: 1,
      items: [{ layout: "line", items: ["hello"] }],
    };
    expect(unroll(line)).toEqual([{ layout: "line", indent: 1, items: ["hello"] }]);
  });

  it("two nested indented lines get the indent combined", () => {
    const line: Line = {
      layout: "line",
      indent: 1,
      items: [{ layout: "line", indent: 1, items: ["hello"] }],
    };
    expect(unroll(line)).toEqual([{ layout: "line", indent: 2, items: ["hello"] }]);
  });

  it("multiple nested lines get indent combined", () => {
    const line: Line = {
      layout: "line",
      indent: 1,
      items: [
        { layout: "line", indent: 1, items: ["hello"] },
        { layout: "line", indent: 2, items: ["world"] },
      ],
    };
    expect(unroll(line)).toEqual([
      { layout: "line", indent: 2, items: ["hello"] },
      { layout: "line", indent: 3, items: ["world"] },
    ]);
  });

  it("triple-nested lines get indent combined", () => {
    const line: Line = {
      layout: "line",
      indent: 1,
      items: [
        {
          layout: "line",
          indent: 1,
          items: [
            { layout: "line", indent: 1, items: ["hello"] },
            { layout: "line", indent: 1, items: ["world"] },
          ],
        },
      ],
    };
    expect(unroll(line)).toEqual([
      { layout: "line", indent: 3, items: ["hello"] },
      { layout: "line", indent: 3, items: ["world"] },
    ]);
  });

  it("nested strings-arrays get converted to flat string array", () => {
    expect(unroll(["1", ["2", ["3"], "4"]])).toEqual(["1", "2", "3", "4"]);
  });

  it("nested strings-arrays inside a line get converted to flat string array", () => {
    expect(unroll([{ layout: "line", items: ["1", ["2"]] }])).toEqual([
      { layout: "line", items: ["1", "2"] },
    ]);
  });

  it("strings after line get appended to the preceding line", () => {
    expect(unroll([{ layout: "line", items: ["sub", "line"] }, "foo", "bar"])).toEqual([
      { layout: "line", items: ["sub", "line", "foo", "bar"] },
    ]);
  });

  it("a line after strings remains the same", () => {
    expect(unroll(["foo", "bar", { layout: "line", items: ["sub", "line"] }])).toEqual([
      "foo",
      "bar",
      { layout: "line", items: ["sub", "line"] },
    ]);
  });

  it("a line between strings gets concatenated with strings after it", () => {
    expect(
      unroll(["foo", "bar", { layout: "line", items: ["sub", "line"] }, "baz", "zap"])
    ).toEqual(["foo", "bar", { layout: "line", items: ["sub", "line", "baz", "zap"] }]);
  });

  it("empty line is preserved", () => {
    const lines: Line[] = [
      { layout: "line", items: ["first"] },
      { layout: "line", items: [] },
      { layout: "line", items: ["second"] },
    ];
    expect(unroll(lines)).toEqual(lines);
  });
});
