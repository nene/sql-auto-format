import { Node, Whitespace } from "sql-parser-cst";
import { LayoutOptions } from "../options";
import { isNode } from "../node_utils";
import { ArrayElement, isArray } from "../utils";

type MaybeContext<T> = T extends Node
  ? Context<T>
  : T extends Node[]
  ? Context<ArrayElement<T>>[]
  : T;

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";

/** Formatting context */
export class Context<T extends Node> {
  constructor(
    private rawNode: T,
    private options: LayoutOptions,
    private parentCtx?: Context<Node>
  ) {}

  /**
   * Returns CST Node property value:
   * - when it's a Node, returns Context<Node>
   * - when it's an array of Nodes, returns Context<Node>[]
   * - otherwise returns it as is
   */
  public get<TKey extends Exclude<keyof T, ReservedKey>>(
    key: TKey
  ): MaybeContext<T[TKey]>;
  // 1 element array
  public get<TKey1 extends Exclude<keyof T, ReservedKey>>(
    keys: [TKey1]
  ): [MaybeContext<T[TKey1]>];
  // 2 element array
  public get<
    TKey1 extends Exclude<keyof T, ReservedKey>,
    TKey2 extends Exclude<keyof T, ReservedKey>
  >(keys: [TKey1, TKey2]): [MaybeContext<T[TKey1]>, MaybeContext<T[TKey2]>];
  // 3 element array
  public get<
    TKey1 extends Exclude<keyof T, ReservedKey>,
    TKey2 extends Exclude<keyof T, ReservedKey>,
    TKey3 extends Exclude<keyof T, ReservedKey>
  >(
    keys: [TKey1, TKey2, TKey3]
  ): [MaybeContext<T[TKey1]>, MaybeContext<T[TKey2]>, MaybeContext<T[TKey3]>];
  // 4 element array
  public get<
    TKey1 extends Exclude<keyof T, ReservedKey>,
    TKey2 extends Exclude<keyof T, ReservedKey>,
    TKey3 extends Exclude<keyof T, ReservedKey>,
    TKey4 extends Exclude<keyof T, ReservedKey>
  >(
    keys: [TKey1, TKey2, TKey3, TKey4]
  ): [
    MaybeContext<T[TKey1]>,
    MaybeContext<T[TKey2]>,
    MaybeContext<T[TKey3]>,
    MaybeContext<T[TKey4]>
  ];
  // 5 element array
  public get<
    TKey1 extends Exclude<keyof T, ReservedKey>,
    TKey2 extends Exclude<keyof T, ReservedKey>,
    TKey3 extends Exclude<keyof T, ReservedKey>,
    TKey4 extends Exclude<keyof T, ReservedKey>,
    TKey5 extends Exclude<keyof T, ReservedKey>
  >(
    keys: [TKey1, TKey2, TKey3, TKey4, TKey5]
  ): [
    MaybeContext<T[TKey1]>,
    MaybeContext<T[TKey2]>,
    MaybeContext<T[TKey3]>,
    MaybeContext<T[TKey4]>,
    MaybeContext<T[TKey5]>
  ];
  // N element array
  public get<TKey extends Exclude<keyof T, ReservedKey>>(
    keys: TKey[]
  ): MaybeContext<T[TKey]>[];
  public get<TKey extends Exclude<keyof T, ReservedKey>>(
    key: TKey | TKey[]
  ): MaybeContext<T[TKey]> | MaybeContext<T[TKey]>[] {
    if (isArray(key)) {
      return key.map((k) => this.get(k));
    } else {
      const value = this.rawNode[key];
      if (isNode(value)) {
        return this.childContext(value) as MaybeContext<T[TKey]>;
      } else if (isArray(value)) {
        // All arrays besides leading/trailing are arrays of Nodes,
        // and the types don't allow calling get() with "leading" or "trailing".
        // So we're safe converting it to Context<Node>[].
        return value.map((v) => this.childContext(v)) as MaybeContext<T[TKey]>;
      } else {
        return value as MaybeContext<T[TKey]>;
      }
    }
  }

  private childContext<TNode extends Node>(childNode: TNode): Context<TNode> {
    return new Context(childNode, this.options, this);
  }

  /** The actual raw Node object */
  public node(): T {
    return this.rawNode;
  }

  /** Type guard to check of the type of Node in this Context */
  public is<TType extends Node["type"]>(
    type: TType
  ): this is Context<Extract<Node, { type: TType }>> {
    return this.rawNode.type === type;
  }

  /** Parent context, if any */
  public parent(): Context<Node> | undefined {
    return this.parentCtx;
  }

  /** Leading whitespace */
  public leading(): Whitespace[] {
    return this.rawNode.leading ?? [];
  }

  /** Trailing whitespace */
  public trailing(): Whitespace[] {
    return this.rawNode.trailing ?? [];
  }

  /** Option value */
  public getOption<TKey extends keyof LayoutOptions>(
    key: TKey
  ): LayoutOptions[TKey] {
    return this.options[key];
  }
}
