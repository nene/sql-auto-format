import { ParserOptions } from "sql-parser-cst";

export interface FormatOptions {
  dialect: ParserOptions["dialect"];
  tabWidth?: number;
}

export interface SerializeOptions {
  tabWidth: number;
}

// For now, just use FormatOptions, later we'll want to extract only specific keys
export type LayoutOptions = Required<FormatOptions>;
