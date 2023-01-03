type NumberLiteral = { type: "number_literal"; value: number };
type FuncCall = { type: "func_call"; name: string; param: NumberLiteral };
type Node = FuncCall | NumberLiteral;

type MaybeContext<T> = T extends Node ? Context<T> : T;

/** Formatting context */
export class Context<T extends Node> {
  constructor(private rawNode: T, private parentCtx?: Context<Node>) {}

  public get<TKey extends keyof T>(key: TKey): MaybeContext<T[TKey]> {
    const value = this.rawNode[key];
    if (isNode(value)) {
      return new Context(value, this) as MaybeContext<T[TKey]>;
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

const isNode = (x: any): x is Node => isObject(x) && typeof x.type === "string";

const isObject = (x: any): x is Record<string, any> =>
  typeof x === "object" && x !== null && !(x instanceof Array);

const ctx = new Context({
  type: "func_call",
  name: "sqrt",
  param: { type: "number_literal", value: 5 },
} as FuncCall);

ctx.get("param").get("value");
