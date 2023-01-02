import { isObject } from "./utils";

// Whitespace items
export enum WS {
  space = 1,
}

export type Layout = Line | string | WS | Layout[];

export type Line = {
  layout: "line";
  indent?: number;
  items: Layout[];
};

export const isLine = (item: Layout): item is Line =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  isObject(item) && (item as any).layout === "line";
