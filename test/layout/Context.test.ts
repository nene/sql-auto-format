import { ColumnDefinition, Whitespace } from "sql-parser-cst";
import { Context } from "../../src/layout/Context";
import { defaultOptions } from "../../src/options";

describe("Context", () => {
  const node: ColumnDefinition = {
    type: "column_definition",
    name: { type: "identifier", text: "`foo`", name: "foo" },
    constraints: [
      { type: "constraint_null", nullKw: { type: "keyword", text: "NULL", name: "NULL" } },
    ],
  };
  let context: Context<ColumnDefinition>;

  beforeEach(() => {
    context = new Context(node, defaultOptions);
  });

  it("get() wraps child Node value in Context", () => {
    const child = context.get("name");
    expect(child).toBeInstanceOf(Context);
    expect(child.node()).toBe(node.name);
    expect(child.parent()).toBe(context);
  });

  it("get() wraps child Node array value in array of Context", () => {
    const children = context.get("constraints");
    expect(children).toBeInstanceOf(Array);
    expect(children[0]).toBeInstanceOf(Context);
    expect(children[0].node()).toBe(node.constraints[0]);
    expect(children[0].parent()).toBe(context);
  });

  it("get() returns non-node values as-is", () => {
    expect(context.get("name").get("text")).toBe("`foo`");
    expect(context.get("dataType")).toBe(undefined);
  });

  it("get() can be called with array", () => {
    const [name, dataType, constraints] = context.get(["name", "dataType", "constraints"]);
    expect(name.get("name")).toBe("foo");
    expect(dataType).toBe(undefined);
    expect(constraints).toBeInstanceOf(Array);
  });

  it("node() returns the wrapped Node object", () => {
    expect(context.node()).toBe(node);
  });

  it("is() allows casting Context<T> to different node type", () => {
    if (context.is("select_clause")) {
      // just testing type-inference here, not expecting to reach this code.
      expect(context.get("selectKw")).toBeTruthy();
    } else {
      expect(context.is("column_definition")).toBe(true);
    }
  });

  it("parent() returns undefined for topmost node", () => {
    expect(context.parent()).toBe(undefined);
  });

  it("leading() and trailing() return empty array when no whitespace", () => {
    expect(context.leading()).toEqual([]);
    expect(context.trailing()).toEqual([]);
  });

  it("leading() and trailing() return whitespace array when present", () => {
    const ws: Whitespace[] = [
      { type: "newline", text: "\n" },
      { type: "line_comment", text: "-- comment" },
    ];
    const ctx = new Context(
      { type: "number_literal", value: 5, text: "5", leading: ws, trailing: ws },
      defaultOptions
    );
    expect(ctx.leading()).toBe(ws);
    expect(ctx.trailing()).toBe(ws);
  });

  it("options get forwarded to child nodes", () => {
    expect(context.getOption("keywordCase")).toBe("preserve");
    expect(context.get("name").getOption("keywordCase")).toBe("preserve");
    expect(context.get("constraints")[0].getOption("keywordCase")).toBe("preserve");
  });

  describe("indent", () => {
    it("defaults to 0", () => {
      expect(context.getIndent()).toBe(0);
    });

    it("calling indent() increases indentation by tabWidth", () => {
      expect(context.indent().getIndent()).toBe(2);
      expect(context.indent().indent().getIndent()).toBe(4);
      expect(context.indent().indent().indent().getIndent()).toBe(6);
    });
  });
});
