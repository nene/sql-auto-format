import { parse, Program } from "sql-parser-cst";
import { isLine, layout } from "./layout";
import { serialize } from "./serialize";
import { unroll } from "./unroll";

/**
 * Takes SQL string and auto-formats it.
 */
export function format(sql: string): string {
  return formatCst(
    parse(sql, {
      dialect: "sqlite",
      preserveComments: true,
      preserveNewlines: true,
    })
  );
}

function formatCst(node: Program): string {
  const lines = unroll(layout(node));
  if (!(lines instanceof Array) || !lines.every(isLine)) {
    throw new Error(
      `Expected array of lines, instead got ${JSON.stringify(lines)}`
    );
  }
  return serialize(lines);
}
