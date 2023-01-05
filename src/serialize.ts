import { curry } from "ramda";
import { LayoutLiteral, UnrolledLine, WS } from "./layout/LayoutTypes";
import { SerializeOptions } from "./options";

export const serialize = curry(
  (options: SerializeOptions, lines: UnrolledLine[]): string => {
    const INDENT = " ".repeat(options.tabWidth);
    return lines
      .map(
        (line) =>
          INDENT.repeat(line.indent || 0) +
          line.items.map(serializeWhitespace).join("")
      )
      .join("\n");
  }
);

const serializeWhitespace = (item: LayoutLiteral): string => {
  switch (item) {
    case WS.space:
      return " ";
    case WS.newline:
      throw new Error("Unexpected newline encountered in serialize()");
    default:
      return item;
  }
};
