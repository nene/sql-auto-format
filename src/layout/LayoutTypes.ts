import { isNumber, isObject, isString } from "../utils";

// Whitespace items
export enum WS {
  space = 1,
  newline = 2,
}

export type LayoutLiteral = string | WS;

export type Layout = Line | LayoutLiteral | Layout[];

export type Line = {
  layout: "line";
  indent?: number;
  items: Layout[];
};

export type UnrolledLayout = UnrolledLine | LayoutLiteral;

export type UnrolledLine = {
  layout: "line";
  indent?: number;
  items: LayoutLiteral[];
};

export const isLine = (item: Layout): item is Line =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  isObject(item) && (item as any).layout === "line";

export const isUnrolledLine = (item: UnrolledLayout): item is UnrolledLine =>
  isLine(item);

export const isLayoutLiteral = (item: Layout): item is string | WS =>
  isNumber(item) || isString(item);

export const isNewline = (item: LayoutLiteral): item is WS.newline =>
  item === WS.newline;

export const isSpace = (item: LayoutLiteral): item is WS.space =>
  item === WS.space;
