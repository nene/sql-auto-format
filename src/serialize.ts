import { isLine, Layout, Line, WS } from "./LayoutTypes";

export function serialize(lines: Line[]): string {
  const INDENT = "  ";
  return lines
    .map(
      (line) =>
        INDENT.repeat(line.indent || 0) +
        line.items.map(serializeWhitespace).join("")
    )
    .join("\n");
}

const serializeWhitespace = (item: string | WS | Line | Layout[]): string => {
  if (isLine(item) || item instanceof Array) {
    throw new Error("Unexpected Line or Array");
  }
  switch (item) {
    case WS.space:
      return " ";
    default:
      return item;
  }
};
