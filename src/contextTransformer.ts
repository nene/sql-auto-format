import { Node } from "sql-parser-cst";
import { Context } from "./Context";

/**
 * A map with a transform function for each Node type,
 * where the nodes are wrapped in Context:
 *
 *     { select_clause: (ctx: Context<SelectClause>) => {},
 *       from_clause: (ctx: Context<FromClause>) => {},
 *       paren_expr: (ctx: Context<ParenExpr>) => {},
 *       ... }
 */
export type ContextTransformMap<T> = {
  [K in Node["type"]]: (
    ctx: Context<
      Extract<
        Node,
        {
          type: K;
        }
      >
    >
  ) => T;
};

/**
 * Creates a function that transforms the whole syntax tree to data type T.
 * @param map An object with a transform function for each CST node type
 */
export function contextTransformer<T>(
  map: Partial<ContextTransformMap<T>>
): (ctx: Context<Node>) => T {
  return (ctx: Context<Node>) => {
    const node = ctx.node();
    const fn = map[node.type] as (
      e: Context<Extract<Node, { type: typeof node["type"] }>>
    ) => T;

    if (!fn) {
      if (!node.type) {
        throw new Error(`No type field on node: ${JSON.stringify(node)}`);
      }
      throw new Error(`No transform map entry for ${node.type}`);
    }

    return fn(ctx);
  };
}

const layout = (ctx: Context<Node> | undefined): string =>
  ctx ? layoutNode(ctx) : "";

const layoutNode = contextTransformer<string>({
  program: (ctx) => ctx.get("statements").map(layout).join(""),
  column_definition: (ctx) =>
    layout(ctx.get("name")) + " " + layout(ctx.get("dataType")),
  identifier: (ctx) => ctx.get("text"),
});
