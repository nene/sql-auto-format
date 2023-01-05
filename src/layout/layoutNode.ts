import { contextTransformer } from "./contextTransformer";
import { indent, Layout, line, WS } from "./LayoutTypes";
import { isStatement } from "../node_utils";
import { spacedLayout } from "./spacedLayout";
import { layoutMultilineListExpr, lineWithSeparator } from "./multilineLayout";
import { layout } from "./layout";

export const layoutNode = contextTransformer<Layout>({
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
      spacedLayout(ctx.get(["right", "specification"]))
    ),
  ],
  join_on_specification: (ctx) => spacedLayout(ctx.get(["onKw", "expr"])),
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
      line(spacedLayout([...ctx.get(["createKw", "tableKw", "name"]), "("])),
      indent(...layoutMultilineListExpr(columns.get("expr"))),
      line(")"),
    ];
  },
  column_definition: (ctx) => spacedLayout(ctx.get(["name", "dataType"])),
  data_type: (ctx) => layout(ctx.get(["nameKw", "params"])),

  // Expressions
  binary_expr: (ctx) => spacedLayout(ctx.get(["left", "operator", "right"])),
  paren_expr: (ctx) =>
    isStatement(ctx.get("expr").node())
      ? ["(", indent(layout(ctx.get("expr"))), line(")")]
      : layout(["(", ctx.get("expr"), ")"]),
  between_expr: (ctx) =>
    spacedLayout(ctx.get(["left", "betweenKw", "begin", "andKw", "end"])),
  list_expr: (ctx) => spacedLayout(ctx.get("items"), [",", WS.space]),
  func_call: (ctx) => layout(ctx.get(["name", "args"])),
  func_args: (ctx) => layout(ctx.get("args")),

  // Tables & columns
  member_expr: (ctx) =>
    ctx.get("property").is("array_subscript")
      ? layout([ctx.get("object"), ctx.get("property")])
      : layout([ctx.get("object"), ".", ctx.get("property")]),
  alias: (ctx) => spacedLayout(ctx.get(["expr", "asKw", "alias"])),
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
