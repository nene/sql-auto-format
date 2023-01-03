import { dropWhile, dropLastWhile, last } from "ramda";
import { LayoutLiteral, UnrolledLine, WS } from "./LayoutTypes";

export function collapseSpaces(lines: UnrolledLine[]): UnrolledLine[] {
  return lines.map((line) => ({
    ...line,
    items: trimRepeating(trimTrailing(trimLeading(line.items))),
  }));
}

const trimLeading = (items: LayoutLiteral[]) => dropWhile(isSpace, items);

const trimTrailing = (items: LayoutLiteral[]) => dropLastWhile(isSpace, items);

const isSpace = (x: LayoutLiteral) => x === WS.space;

const trimRepeating = (items: LayoutLiteral[]) => {
  const result: LayoutLiteral[] = [];
  for (const x of items) {
    if (x === WS.space && last(result) === WS.space) {
      // skip duplicate space
    } else {
      result.push(x);
    }
  }
  return result;
};
