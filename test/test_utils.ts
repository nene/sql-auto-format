import { parse as parseCst } from "sql-parser-cst";
import { format as originalFormat } from "../src/format";

export function parse(sql: string) {
  return parseCst(sql, {
    dialect: "sqlite",
    preserveComments: true,
    preserveNewlines: true,
  });
}

/** Like the actual format() function, but with a default dialect */
export function format(sql: string) {
  return originalFormat(sql, { dialect: "sqlite" });
}
