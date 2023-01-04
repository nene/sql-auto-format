import { Node } from "sql-parser-cst";
import { isArray, isObject, isString } from "./utils";

// Extracts element type from array type
// https://stackoverflow.com/a/57447842/15982
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

type MaybeContext<T> = T extends Node
  ? Context<T>
  : T extends Node[]
  ? Context<ArrayElement<T>>[]
  : T;

/** Formatting context */
export class Context<T extends Node> {
  constructor(private rawNode: T, private parentCtx?: Context<Node>) {}

  public get<TKey extends keyof T>(key: TKey): MaybeContext<T[TKey]> {
    const value = this.rawNode[key];
    if (isNode(value)) {
      return new Context(value, this) as MaybeContext<T[TKey]>;
    } else if (isNodeArray(value)) {
      return value.map((v) => new Context(v, this)) as MaybeContext<T[TKey]>;
    } else {
      return value as MaybeContext<T[TKey]>;
    }
  }

  public node(): T {
    return this.rawNode;
  }

  public parent(): Context<Node> | undefined {
    return this.parentCtx;
  }
}

const isNode = (x: any): x is Node =>
  isObject(x) &&
  isString(x.type) &&
  x.type !== "leading" &&
  x.type !== "trailing";

const isNodeArray = (x: any): x is Node[] => isArray(x) && x.every(isNode);

type ContextTransformMap<T> = {
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
