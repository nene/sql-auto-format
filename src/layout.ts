import { Node, Whitespace, cstTransformer, Statement } from "sql-parser-cst";
import { Layout, Line, WS } from "./LayoutTypes";
import { isDefined, isNumber, isString } from "./utils";

type NodeArray = (Node | NodeArray | string | WS | undefined)[];

export function layout(node: Node | string | WS | NodeArray): Layout {
  if (isString(node) || isNumber(node)) {
    return node;
  }
  if (node instanceof Array) {
    return node.filter(isDefined).map(layout);
  }

  const leading = layoutWhitespace(node.leading, node);
  const trailing = layoutWhitespace(node.trailing, node);
  if (leading.length || trailing.length) {
    return [...leading, layoutNode(node), ...trailing];
  }

  return layoutNode(node);
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
        result.push(line(ws.text));
      } else {
        result.push(WS.space, ws.text);
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
  nodes: NodeArray,
  separators: (string | WS)[] = [WS.space]
): Layout {
  return joinLayoutArray(layout(nodes) as Layout[], separators);
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

const layoutNode = cstTransformer<Layout>({
  program: (node) => node.statements.map(layout).map(lineWithSeparator(";")),
  empty: () => [],

  // SELECT statement
  select_stmt: (node) => node.clauses.map(layout),
  // SELECT
  select_clause: (node) => [
    line(layout(node.selectKw)),
    indent(...node.columns.items.map(layout).map(lineWithSeparator(","))),
  ],
  // FROM
  from_clause: (node) => [line(layout(node.fromKw)), indent(layout(node.expr))],

  create_table_stmt: (node) => {
    if (!node.columns) {
      throw new Error("Unimplemented: CREATE TABLE without columns");
    }
    return [
      line(spacedLayout([node.createKw, node.tableKw, node.name, "("])),
      indent(node.columns.expr.items.map(layout).map(lineWithSeparator(","))),
      line(")"),
    ];
  },
  column_definition: (node) => spacedLayout([node.name, node.dataType]),
  data_type: (node) => layout([node.nameKw, node.params]),

  // Expressions
  binary_expr: (node) => spacedLayout([node.left, node.operator, node.right]),
  paren_expr: (node) => layout(["(", node.expr, ")"]),
  list_expr: (node) => spacedLayout(node.items, [",", WS.space]),

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
