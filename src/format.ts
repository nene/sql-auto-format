import { parse, ParserOptions, Program } from "sql-parser-cst";
import { collapseSpaces } from "./collapseSpaces";
import { layout } from "./layout";
import { serialize } from "./serialize";
import { startWithEmptyLine } from "./startWithEmptyLine";
import { unrollToLines } from "./unroll";

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
  return serialize(
    collapseSpaces(unrollToLines(layout(startWithEmptyLine(node))))
  ).trim();
}
