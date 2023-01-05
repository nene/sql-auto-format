import { Node, Whitespace } from "sql-parser-cst";
import { Context } from "./Context";
import { Layout, line, WS } from "./LayoutTypes";
import { isStatement } from "../node_utils";

export function withWhitespace<T extends Node>(
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
