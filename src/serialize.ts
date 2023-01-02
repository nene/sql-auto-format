import { LayoutLiteral, UnrolledLine, WS } from "./LayoutTypes";

export function serialize(lines: UnrolledLine[]): string {
  const INDENT = "  ";
  return lines
    .map(
      (line) =>
        INDENT.repeat(line.indent || 0) +
        line.items.map(serializeWhitespace).join("")
    )
    .join("\n");
}

const serializeWhitespace = (item: LayoutLiteral): string => {
  switch (item) {
    case WS.space:
      return " ";
    default:
      return item;
  }
};
