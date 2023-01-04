import { Node } from "sql-parser-cst";
import { FormatOptions } from "./format";
import { isNode, isNodeArray } from "./node_utils";
import { ArrayElement } from "./utils";

type MaybeContext<T> = T extends Node
  ? Context<T>
  : T extends Node[]
  ? Context<ArrayElement<T>>[]
  : T;

// Keys of Node objects that have special meaning
type ReservedKey = "type" | "range" | "leading" | "trailing";

// For now, just use FormatOptions, later we'll want to extract only specific keys
type LayoutOptions = Required<FormatOptions>;

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
  ): MaybeContext<T[TKey]> {
    const value = this.rawNode[key];
    if (isNode(value)) {
      return this.childContext(value) as MaybeContext<T[TKey]>;
    } else if (isNodeArray(value)) {
      return value.map((v) => this.childContext(v)) as MaybeContext<T[TKey]>;
    } else {
      return value as MaybeContext<T[TKey]>;
    }
  }

  private childContext<TNode extends Node>(childNode: TNode): Context<TNode> {
    return new Context(childNode, this.options, this);
  }

  /** The actual raw Node object */
  public node(): T {
    return this.rawNode;
  }

  /** Parent context, if any */
  public parent(): Context<Node> | undefined {
    return this.parentCtx;
  }

  /** Option value */
  public getOption<TKey extends keyof LayoutOptions>(
    key: TKey
  ): LayoutOptions[TKey] {
    return this.options[key];
  }
}
