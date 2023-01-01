import { parse, ParserOptions, Program } from "sql-parser-cst";
import { collapseSpaces } from "./collapseSpaces";
import { layout } from "./layout";
import { serialize } from "./serialize";
import { remainingStringsToLines, unroll } from "./unroll";

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
  const layoutItems = unroll(layout(node));
  if (!(layoutItems instanceof Array)) {
    throw new Error(
      `Expected array, instead got ${JSON.stringify(layoutItems)}`
    );
  }
  return serialize(collapseSpaces(remainingStringsToLines(layoutItems)));
}
