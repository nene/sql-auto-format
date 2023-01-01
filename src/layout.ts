import { Node, Whitespace, cstTransformer } from "sql-parser-cst";
import { isObject, isString } from "./utils";

export type Layout = Line | string | Layout[];

export type Line = {
  layout: "line";
  indent?: number;
  items: Layout[];
};

export const isLine = (item: Layout): item is Line =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  isObject(item) && (item as any).layout === "line";

type NodeArray = (Node | NodeArray | string)[];

export function layout(node: Node | string | NodeArray): Layout {
  if (isString(node)) {
    return node;
  }
  if (node instanceof Array) {
    return joinLayoutArray(node.map(layout), " ");
  }

  const leading = layoutComments(node.leading);
  const trailing = layoutComments(node.trailing);
  if (leading.length || trailing.length) {
    return [...leading, layoutNode(node), ...trailing];
  }

  return layoutNode(node);
}

const layoutComments = (items?: Whitespace[]): Layout[] => {
  const result: Layout[] = [];
  (items || []).forEach((ws, i, arr) => {
    const prev = arr[i - 1];
    if (ws.type === "block_comment") {
      if (prev?.type === "newline") {
        result.push(line(ws.text));
      } else {
        result.push(ws.text);
      }
    } else if (ws.type === "line_comment") {
      if (prev?.type === "newline") {
        result.push(line(ws.text));
      } else {
        result.push(" ", ws.text);
      }
    }
  });
  return result;
};

function joinLayoutArray(array: Layout[], separator = " "): Layout[] {
  const result: Layout[] = [];
  for (const it of array) {
    if (result.length > 0) {
      result.push(separator);
    }
    result.push(it);
  }
  return result;
}

const layoutNode = cstTransformer<Layout>({
  program: (node) => node.statements.map(layout),
  empty: () => "",

  // SELECT statement
  select_stmt: (node) => node.clauses.map(layout),
  // SELECT
  select_clause: (node) => [
    line(layout(node.selectKw)),
    indent(...node.columns.items.map(layout).map(lineWithSeparator(","))),
  ],
  // FROM
  from_clause: (node) => [line(layout(node.fromKw)), indent(layout(node.expr))],

  // Expressions
  binary_expr: ({ left, operator, right }) => layout([left, operator, right]),

  // Tables & columns
  member_expr: (node) =>
    node.property.type === "array_subscript"
      ? layout([node.object, node.property])
      : [layout(node.object), ".", layout(node.property)],
  alias: (node) =>
    node.asKw
      ? layout([node.expr, node.asKw, node.alias])
      : layout([node.expr, node.alias]),
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
