import dedent from "dedent-js";
import { layout, showFuncCall } from "../src/prettier";

describe("prettier", () => {
  it("performs layout", () => {
    expect(
      layout(
        showFuncCall({
          type: "func_call",
          name: "sqrt",
          args: [
            { type: "func_call", name: "foo", args: [] },
            {
              type: "func_call",
              name: "add",
              args: [
                { type: "func_call", name: "a", args: [] },
                { type: "func_call", name: "b", args: [] },
              ],
            },
          ],
        })
      )
    ).toEqual(dedent`
      sqrt(
        foo,
        add(
          a,
          b
        )
      )
    `);
  });

  it("performs show", () => {
    expect(
      showFuncCall({
        type: "func_call",
        name: "sqrt",
        args: [{ type: "func_call", name: "foo", args: [] }],
      }).inspect()
    ).toEqual(`["sqrt" Text ["(" Text [2 Line ["foo" Text [0 Line [")" Text Nil]]]]]]`);
  });
});
