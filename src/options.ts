import { ParserOptions } from "sql-parser-cst";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
  tabWidth?: number;
  keywordCase?: "upper" | "lower" | "preserve";
  printWidth?: number;
}

export interface SerializeOptions {
  tabWidth: number;
}

export type LayoutOptions = {
  keywordCase: "upper" | "lower" | "preserve";
  printWidth: number;
};
