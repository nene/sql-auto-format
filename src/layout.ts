import { Node, Whitespace, ListExpr } from "sql-parser-cst";
import { Context } from "./Context";
import { contextTransformer } from "./contextTransformer";
import { Layout, Line, WS } from "./LayoutTypes";
import { isStatement } from "./node_utils";
import { arrayWrap, isArray, isDefined, isNumber, isString } from "./utils";

type NodeArray = (Context<Node> | NodeArray | string | WS | undefined)[];

export function layout(node: Context<Node> | string | WS | NodeArray): Layout {
  if (isString(node) || isNumber(node)) {
    return node;
  }
  if (isArray(node)) {
    return node.filter(isDefined).map(layout);
  }

  return withWhitespace(node, layoutNode);
}

function withWhitespace<T extends Node>(
  ctx: Context<T>,
  layoutFn: (ctx: Context<T>) => Layout
): Layout {
  const leading = layoutWhitespace(ctx.leading(), ctx);
  const trailing = layoutWhitespace(ctx.trailing(), ctx);
  if (leading.length || trailing.length) {
    return [...leading, layoutFn(ctx), ...trailing];
  }
  return layoutFn(ctx);
}

const layoutWhitespace = (
  whitespaceItems: Whitespace[],
  ctx: Context<Node>
): Layout[] => {
  const result: Layout[] = [];
  whitespaceItems.forEach((ws, i, arr) => {
    const prev = arr[i - 1];
    if (ws.type === "block_comment") {
      if (prev?.type === "newline") {
        result.push(line(ws.text));
      } else {
        result.push(WS.space, ws.text, WS.space);
      }
    } else if (ws.type === "line_comment") {
      if (prev?.type === "newline") {
        result.push(line(ws.text, WS.newline));
      } else {
        result.push(WS.space, ws.text, WS.newline);
      }
    } else if (
      isStatement(ctx.node()) &&
      ws.type === "newline" &&
      prev?.type === "newline"
    ) {
      result.push(line());
    }
  });
  return result;
};

function spacedLayout(
  nodes: Context<Node> | string | WS | NodeArray,
  separators: (string | WS)[] = [WS.space]
): Layout {
  return joinLayoutArray(layout(arrayWrap(nodes)) as Layout[], separators);
}

function joinLayoutArray(
  array: Layout[],
  separators: (string | WS)[]
): Layout[] {
  const result: Layout[] = [];
  for (const it of array) {
    if (result.length > 0) {
      result.push(...separators);
    }
    result.push(it);
  }
  return result;
}

function layoutMultilineListExpr(ctx: Context<ListExpr>): Layout[] {
  return arrayWrap(
    withWhitespace(ctx, (c) =>
      c.get("items").map(layout).map(lineWithSeparator(","))
    )
  );
}

const layoutNode = contextTransformer<Layout>({
  program: (ctx) =>
    ctx.get("statements").map(layout).map(lineWithSeparator(";")),
  empty: () => [],

  // SELECT statement
  select_stmt: (ctx) => ctx.get("clauses").map(layout),
  // SELECT
  select_clause: (ctx) => [
    line(layout(ctx.get("selectKw"))),
    indent(...layoutMultilineListExpr(ctx.get("columns"))),
  ],
  // FROM
  from_clause: (ctx) => [
    line(layout(ctx.get("fromKw"))),
    indent(layout(ctx.get("expr"))),
  ],
  join_expr: (ctx) => [
    line(layout(ctx.get("left"))),
    line(
      spacedLayout(ctx.get("operator")),
      WS.space,
      spacedLayout([ctx.get("right"), ctx.get("specification")])
    ),
  ],
  join_on_specification: (ctx) =>
    spacedLayout([ctx.get("onKw"), ctx.get("expr")]),
  // WHERE
  where_clause: (ctx) => [
    line(layout(ctx.get("whereKw"))),
    indent(layout(ctx.get("expr"))),
  ],
  // ORDER BY
  order_by_clause: (ctx) => [
    line(spacedLayout(ctx.get("orderByKw"))),
    indent(...layoutMultilineListExpr(ctx.get("specifications"))),
  ],
  sort_specification: (ctx) =>
    spacedLayout([ctx.get("expr"), ctx.get("orderKw")]),
  // LIMIT
  limit_clause: (ctx) => [
    line(layout(ctx.get("limitKw"))),
    indent(layout(ctx.get("count"))),
  ],

  create_table_stmt: (ctx) => {
    const columns = ctx.get("columns");
    if (!columns) {
      throw new Error("Unimplemented: CREATE TABLE without columns");
    }
    return [
      line(
        spacedLayout([
          ctx.get("createKw"),
          ctx.get("tableKw"),
          ctx.get("name"),
          "(",
        ])
      ),
      indent(...layoutMultilineListExpr(columns.get("expr"))),
      line(")"),
    ];
  },
  column_definition: (ctx) =>
    spacedLayout([ctx.get("name"), ctx.get("dataType")]),
  data_type: (ctx) => layout([ctx.get("nameKw"), ctx.get("params")]),

  // Expressions
  binary_expr: (ctx) =>
    spacedLayout([ctx.get("left"), ctx.get("operator"), ctx.get("right")]),
  paren_expr: (ctx) =>
    isStatement(ctx.get("expr").node())
      ? ["(", indent(layout(ctx.get("expr"))), line(")")]
      : layout(["(", ctx.get("expr"), ")"]),
  list_expr: (ctx) => spacedLayout(ctx.get("items"), [",", WS.space]),
  func_call: (ctx) => layout([ctx.get("name"), ctx.get("args")]),
  func_args: (ctx) => layout(ctx.get("args")),

  // Tables & columns
  member_expr: (ctx) =>
    ctx.get("property").is("array_subscript")
      ? layout([ctx.get("object"), ctx.get("property")])
      : layout([ctx.get("object"), ".", ctx.get("property")]),
  alias: (ctx) =>
    spacedLayout([ctx.get("expr"), ctx.get("asKw"), ctx.get("alias")]),
  all_columns: () => "*",

  // Basic language elements
  keyword: (ctx) => {
    switch (ctx.getOption("keywordCase")) {
      case "upper":
        return ctx.get("name");
      case "lower":
        return ctx.get("text").toLowerCase();
      case "preserve":
        return ctx.get("text");
    }
  },
  identifier: (ctx) => ctx.get("text"),
  string_literal: (ctx) => ctx.get("text"),
  number_literal: (ctx) => ctx.get("text"),
  boolean_literal: (ctx) => ctx.get("text"),
  null_literal: (ctx) => ctx.get("text"),
});

const lineWithSeparator =
  (separator: string) => (item: Layout, i: number, allItems: Layout[]) =>
    i < allItems.length - 1 ? line(item, separator) : line(item);

// utils for easy creation of lines

const line = (...items: Layout[]): Line => ({ layout: "line", items });

const indent = (...items: Layout[]): Line => ({
  layout: "line",
  indent: 1,
  items,
});
