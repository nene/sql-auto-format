import { Node } from "sql-parser-cst";
import { Context } from "./Context";
import { Layout, WS } from "./LayoutTypes";
import { isArray } from "../utils";
import { layout, NodeArray } from "./layout";

export function spacedLayout(
  nodes: Context<Node> | string | WS | NodeArray,
  separators: (string | WS)[] = [WS.space]
): Layout {
  return isArray(nodes) ? joinArray(layout(nodes), separators) : layout(nodes);
}

function joinArray<T>(array: T[], separators: T[]): T[] {
  const result: T[] = [];
  for (const it of array) {
    if (result.length > 0) {
      result.push(...separators);
    }
    result.push(it);
  }
  return result;
}
