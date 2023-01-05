import { Node } from "sql-parser-cst";
import { Context } from "./Context";
import { Layout, WS } from "./LayoutTypes";
import { isArray, isDefined, isNumber, isString } from "../utils";
import { withWhitespace } from "./whitespace";
import { layoutNode } from "./layoutNode";

export type NodeArray = (Context<Node> | NodeArray | string | WS | undefined)[];

export function layout(node: NodeArray): Layout[];
export function layout(node: Context<Node> | string | WS | NodeArray): Layout;
export function layout(node: Context<Node> | string | WS | NodeArray): Layout {
  if (isString(node) || isNumber(node)) {
    return node;
  }
  if (isArray(node)) {
    return node.filter(isDefined).map(layout);
  }

  return withWhitespace(node, layoutNode);
}
