import { FuncCall, pretty, showFuncCall } from "../src/prettier";

describe("prettier", () => {
  it("performs show", () => {
    expect(
      showFuncCall({
        type: "func_call",
        name: "sqrt",
        args: [{ type: "func_call", name: "foo", args: [] }],
      }).inspect()
    ).toMatchInlineSnapshot(
      `"["sqrt" Text ["(" Text [[" " Text ["foo" Text [" " Text [")" Text Nil]]]] Union [2 Line ["foo" Text [0 Line [")" Text Nil]]]]]]]"`
    );
  });

  const funcCall: FuncCall = {
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
  };

  it("performs pretty with line-width: 10", () => {
    expect(pretty(10, showFuncCall(funcCall))).toMatchInlineSnapshot(`
      "sqrt(
        foo,
        add(
          a,
          b
        )
      )"
    `);
  });

  it("performs pretty with line-width: 15", () => {
    expect(pretty(15, showFuncCall(funcCall))).toMatchInlineSnapshot(`
      "sqrt(
        foo,
        add( a, b )
      )"
    `);
  });

  it("performs pretty with line-width: 80", () => {
    expect(pretty(80, showFuncCall(funcCall))).toMatchInlineSnapshot(`"sqrt( foo, add( a, b ) )"`);
  });
});
