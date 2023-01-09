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
    ).toMatchInlineSnapshot(`
      {
        "doc": {
          "doc": {
            "doc": {
              "doc": {
                "doc": {
                  "doc": {
                    "doc": {
                      "doc": {
                        "doc": {
                          "doc": {
                            "doc": {
                              "doc": {
                                "doc": {
                                  "doc": {
                                    "doc": {
                                      "doc": {
                                        "doc": {
                                          "type": "nil",
                                        },
                                        "text": ")",
                                        "type": "text",
                                      },
                                      "indent": 0,
                                      "type": "line",
                                    },
                                    "text": ")",
                                    "type": "text",
                                  },
                                  "indent": 2,
                                  "type": "line",
                                },
                                "text": "b",
                                "type": "text",
                              },
                              "indent": 4,
                              "type": "line",
                            },
                            "text": ",",
                            "type": "text",
                          },
                          "text": "a",
                          "type": "text",
                        },
                        "indent": 4,
                        "type": "line",
                      },
                      "text": "(",
                      "type": "text",
                    },
                    "text": "add",
                    "type": "text",
                  },
                  "indent": 2,
                  "type": "line",
                },
                "text": ",",
                "type": "text",
              },
              "text": "foo",
              "type": "text",
            },
            "indent": 2,
            "type": "line",
          },
          "text": "(",
          "type": "text",
        },
        "text": "sqrt",
        "type": "text",
      }
    `);
  });
});
