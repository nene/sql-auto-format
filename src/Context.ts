import { FuncCall, Node } from "sql-parser-cst";
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

const ctx = new Context({
  type: "func_call",
  name: { type: "identifier", name: "sqrt", text: "sqrt" },
  args: {
    type: "paren_expr",
    expr: { type: "func_args", args: { type: "list_expr", items: [] } },
  },
} as FuncCall);

ctx.get("args")?.get("expr").get("args").get("items");
