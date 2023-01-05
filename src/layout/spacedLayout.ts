import { Node } from "sql-parser-cst";
import { Context } from "./Context";
import { Layout, WS } from "./LayoutTypes";
import { arrayWrap } from "../utils";
import { layout, NodeArray } from "./layout";

export function spacedLayout(
  nodes: Context<Node> | string | WS | NodeArray,
  separators: (string | WS)[] = [WS.space]
): Layout {
  return joinLayoutArray(layout(arrayWrap(nodes)), separators);
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
