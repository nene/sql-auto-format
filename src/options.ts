import { ParserOptions } from "sql-parser-cst";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
  tabWidth?: number;
  keywordCase?: "upper" | "lower" | "preserve";
}

export interface SerializeOptions {
  tabWidth: number;
}

export type LayoutOptions = {
  keywordCase: "upper" | "lower" | "preserve";
};
