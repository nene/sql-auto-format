import { UnrolledLine, WS } from "../src/layout/LayoutTypes";
import { splitLines } from "../src/splitLines";

describe("splitLines()", () => {
  it("leaves line without newlines as is", () => {
    const lines: UnrolledLine[] = [{ layout: "line", items: ["foo", WS.space, "bar"] }];
    expect(splitLines(lines)).toEqual(lines);
  });

  it("breaks up line with newline in the middle", () => {
    expect(
      splitLines([{ layout: "line", items: ["foo1", "foo2", WS.newline, "bar1", "bar2"] }])
    ).toEqual([
      { layout: "line", items: ["foo1", "foo2"] },
      { layout: "line", items: ["bar1", "bar2"] },
    ]);
  });

  it("breaks a line with multiple newlines in the middle still to just two lines", () => {
    expect(
      splitLines([
        { layout: "line", items: ["foo1", "foo2", WS.newline, WS.newline, "bar1", "bar2"] },
      ])
    ).toEqual([
      { layout: "line", items: ["foo1", "foo2"] },
      { layout: "line", items: ["bar1", "bar2"] },
    ]);
  });

  it("ignores newline at the end of line", () => {
    expect(splitLines([{ layout: "line", items: ["foo", "bar", WS.newline] }])).toEqual([
      { layout: "line", items: ["foo", "bar"] },
    ]);
  });

  it("ignores newline at the start of line", () => {
    expect(splitLines([{ layout: "line", items: [WS.newline, "foo", "bar"] }])).toEqual([
      { layout: "line", items: ["foo", "bar"] },
    ]);
  });

  it("ignores multiple newlines at the start and end of line", () => {
    expect(
      splitLines([
        { layout: "line", items: [WS.newline, WS.newline, "foo", "bar", WS.newline, WS.newline] },
      ])
    ).toEqual([{ layout: "line", items: ["foo", "bar"] }]);
  });
});
