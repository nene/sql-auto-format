import { Program } from "sql-parser-cst";

/**
 * Adds empty line before the main program node.
 *
 * This allows layout() to uniformly treat comments that should
 * be on a separate line - they always come after a newline.
 * Without this, the very first comment in a file would not have
 * a leading newline, and without having the context, it would
 * be hard to say whether that comment should be rendered on a
 * separate line.
 */
export function startWithEmptyLine(node: Program): Program {
  const leading = node.leading || [];
  if (leading[0]?.type === "newline") {
    return node;
  }
  return {
    ...node,
    leading: [{ type: "newline", text: "\n" }, ...(node.leading || [])],
  };
}
