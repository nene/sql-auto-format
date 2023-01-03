import {
  Node,
  Whitespace,
  cstTransformer,
  Statement,
  ListExpr,
} from "sql-parser-cst";
import { Layout, Line, WS } from "./LayoutTypes";
import { arrayWrap, isArray, isDefined, isNumber, isString } from "./utils";

type NodeArray = (Node | NodeArray | string | WS | undefined)[];

export function layout(node: Node | string | WS | NodeArray): Layout {
  if (isString(node) || isNumber(node)) {
    return node;
  }
  if (isArray(node)) {
    return node.filter(isDefined).map(layout);
  }

  return withWhitespace(node, layoutNode);
}

function withWhitespace<T extends Node>(
  node: T,
  layoutFn: (node: T) => Layout
): Layout {
  const leading = layoutWhitespace(node.leading, node);
  const trailing = layoutWhitespace(node.trailing, node);
  if (leading.length || trailing.length) {
    return [...leading, layoutFn(node), ...trailing];
  }
  return layoutFn(node);
}

const layoutWhitespace = (
  whitespaceItems: Whitespace[] | undefined,
  node: Node
): Layout[] => {
  const result: Layout[] = [];
  (whitespaceItems || []).forEach((ws, i, arr) => {
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
      isStatement(node) &&
      ws.type === "newline" &&
      prev?.type === "newline"
    ) {
      result.push(line());
    }
  });
  return result;
};

const isStatement = (node: Node): node is Statement => /_stmt$/.test(node.type);

function spacedLayout(
  nodes: Node | string | WS | NodeArray,
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

function layoutMultilineListExpr(node: ListExpr): Layout[] {
  return arrayWrap(
    withWhitespace(node, (n) => n.items.map(layout).map(lineWithSeparator(",")))
  );
}

const layoutNode = cstTransformer<Layout>({
  program: (node) => node.statements.map(layout).map(lineWithSeparator(";")),
  empty: () => [],

  // SELECT statement
  select_stmt: (node) => node.clauses.map(layout),
  // SELECT
  select_clause: (node) => [
    line(layout(node.selectKw)),
    indent(...layoutMultilineListExpr(node.columns)),
  ],
  // FROM
  from_clause: (node) => [line(layout(node.fromKw)), indent(layout(node.expr))],
  join_expr: (node) => [
    line(layout(node.left)),
    line(
      spacedLayout(node.operator),
      WS.space,
      spacedLayout([node.right, node.specification])
    ),
  ],
  join_on_specification: (node) => spacedLayout([node.onKw, node.expr]),
  // WHERE
  where_clause: (node) => [
    line(layout(node.whereKw)),
    indent(layout(node.expr)),
  ],
  // ORDER BY
  order_by_clause: (node) => [
    line(spacedLayout(node.orderByKw)),
    indent(...layoutMultilineListExpr(node.specifications)),
  ],
  sort_specification: (node) => spacedLayout([node.expr, node.orderKw]),
  limit_clause: (node) => [
    line(layout(node.limitKw)),
    indent(layout(node.count)),
  ],

  create_table_stmt: (node) => {
    if (!node.columns) {
      throw new Error("Unimplemented: CREATE TABLE without columns");
    }
    return [
      line(spacedLayout([node.createKw, node.tableKw, node.name, "("])),
      indent(...layoutMultilineListExpr(node.columns.expr)),
      line(")"),
    ];
  },
  column_definition: (node) => spacedLayout([node.name, node.dataType]),
  data_type: (node) => layout([node.nameKw, node.params]),

  // Expressions
  binary_expr: (node) => spacedLayout([node.left, node.operator, node.right]),
  paren_expr: (node) =>
    isStatement(node.expr)
      ? ["(", indent(layout(node.expr)), line(")")]
      : layout(["(", node.expr, ")"]),
  list_expr: (node) => spacedLayout(node.items, [",", WS.space]),
  func_call: (node) => layout([node.name, node.args]),
  func_args: (node) => layout(node.args),

  // Tables & columns
  member_expr: (node) =>
    node.property.type === "array_subscript"
      ? layout([node.object, node.property])
      : layout([node.object, ".", node.property]),
  alias: (node) => spacedLayout([node.expr, node.asKw, node.alias]),
  all_columns: () => "*",

  // Basic language elements
  keyword: (node) => node.text,
  identifier: (node) => node.text,
  string_literal: (node) => node.text,
  number_literal: (node) => node.text,
  boolean_literal: (node) => node.text,
  null_literal: (node) => node.text,
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
