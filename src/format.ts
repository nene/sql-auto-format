import { parse } from "sql-parser-cst";
import { collapseSpaces } from "./collapseSpaces";
import { layout } from "./layout/layout";
import { serialize } from "./serialize";
import { splitLines } from "./splitLines";
import { startWithEmptyLine } from "./startWithEmptyLine";
import { unroll } from "./unroll";
import { pipe, trim, curry } from "ramda";
import { FormatOptions, ReqFormatOptions, defaultOptions } from "./options";
import { Context } from "./layout/Context";

/**
 * Takes SQL string and auto-formats it.
 */
export function format(sql: string, options: FormatOptions): string {
  const cfg = assignDefaults(options);

  return pipe(
    parseToCst(cfg),
    startWithEmptyLine,
    (node) => new Context(node, cfg),
    layout,
    unroll,
    splitLines,
    collapseSpaces,
    serialize(cfg),
    trim
  )(sql);
}

function assignDefaults(options: FormatOptions): ReqFormatOptions {
  return {
    ...defaultOptions,
    ...options,
  };
}

const parseToCst = curry((options: FormatOptions, sql: string) => {
  return parse(sql, {
    dialect: options.dialect,
    preserveComments: true,
    preserveNewlines: true,
  });
});
