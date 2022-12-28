import { parse, ParserOptions, Program } from "sql-parser-cst";
import { isLine, layout } from "./layout";
import { serialize } from "./serialize";
import { unroll } from "./unroll";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
}

/**
 * Takes SQL string and auto-formats it.
 */
export function format(sql: string, options: FormatOptions): string {
  return formatCst(
    parse(sql, {
      dialect: options.dialect,
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
