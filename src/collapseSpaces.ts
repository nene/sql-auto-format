import { dropWhile } from "ramda";
import { last } from "./utils";
import { LayoutLiteral, UnrolledLine, WS } from "./LayoutTypes";

export function collapseSpaces(lines: UnrolledLine[]): UnrolledLine[] {
  return lines.map((line) => ({
    ...line,
    items: trimRepeating(trimTrailing(trimLeading(line.items))),
  }));
}

const trimLeading = (items: LayoutLiteral[]) =>
  dropWhile((x) => x === WS.space, items);

const trimTrailing = (items: LayoutLiteral[]) =>
  trimLeading(items.reverse()).reverse();

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
