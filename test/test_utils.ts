import { parse as parseCst } from "sql-parser-cst";

export function parse(sql: string) {
  return parseCst(sql, {
    dialect: "sqlite",
    preserveComments: true,
    preserveNewlines: true,
  });
}
