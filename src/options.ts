import { ParserOptions } from "sql-parser-cst";

export interface FormatOptions
  extends Partial<SerializeOptions>,
    Partial<LayoutOptions> {
  dialect: ParserOptions["dialect"];
}

export interface SerializeOptions {
  tabWidth: number;
}

export type LayoutOptions = {
  keywordCase: "upper" | "lower" | "preserve";
  printWidth: number;
};
