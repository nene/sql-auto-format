import { Node, Statement } from "sql-parser-cst";
import { isArray, isObject, isString } from "./utils";

/** True when value is Node */
export const isNode = (x: any): x is Node =>
  isObject(x) &&
  isString(x.type) &&
  x.type !== "leading" &&
  x.type !== "trailing";

/** True when all values in array are Nodes */
export const isNodeArray = (x: any): x is Node[] =>
  isArray(x) && x.every(isNode);

/** True when dealing with one of the Statement nodes */
export const isStatement = (node: Node): node is Statement =>
  /_stmt$/.test(node.type);
