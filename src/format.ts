import { parse, ParserOptions, Program } from "sql-parser-cst";
import { Box } from "./Box";
import { collapseSpaces } from "./collapseSpaces";
import { layout } from "./layout";
import { serialize } from "./serialize";
import { splitLines } from "./splitLines";
import { startWithEmptyLine } from "./startWithEmptyLine";
import { unroll } from "./unroll";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
  tabWidth?: number;
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
    }),
    assignDefaults(options)
  );
}

function assignDefaults(options: FormatOptions): Required<FormatOptions> {
  return {
    tabWidth: 2,
    ...options,
  };
}

function formatCst(node: Program, options: Required<FormatOptions>): string {
  return new Box(node)
    .map(startWithEmptyLine)
    .map(layout)
    .map(unroll)
    .map(splitLines)
    .map(collapseSpaces)
    .map(serialize(options))
    .map((s) => s.trim())
    .unbox();
}
