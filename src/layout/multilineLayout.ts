import { ListExpr } from "sql-parser-cst";
import { Context } from "./Context";
import { Layout, line } from "./LayoutTypes";
import { arrayWrap } from "../utils";
import { withWhitespace } from "./whitespace";
import { layout } from "./layout";

export function layoutMultilineListExpr(ctx: Context<ListExpr>): Layout[] {
  return arrayWrap(
    withWhitespace(ctx, (c) =>
      c.get("items").map(layout).map(lineWithSeparator(","))
    )
  );
}

export const lineWithSeparator =
  (separator: string) => (item: Layout, i: number, allItems: Layout[]) =>
    i < allItems.length - 1 ? line(item, separator) : line(item);
