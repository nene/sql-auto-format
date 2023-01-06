import { ParserOptions } from "sql-parser-cst";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
  tabWidth?: number;
  keywordCase?: "upper" | "lower" | "preserve";
  printWidth?: number;
}

export type ReqFormatOptions = Required<FormatOptions>;

export const defaultOptions: ReqFormatOptions = {
  dialect: "sqlite",
  tabWidth: 2,
  keywordCase: "preserve",
  printWidth: 80,
};
