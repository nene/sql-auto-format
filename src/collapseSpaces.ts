import { dropWhile, last } from "./utils";
import { Line, WS } from "./LayoutTypes";

export function collapseSpaces(lines: Line[]): Line[] {
  return lines.map((line) => ({
    ...line,
    items: trimRepeating(
      trimTrailing(trimLeading(line.items as (string | WS)[]))
    ),
  }));
}

const trimLeading = (items: (string | WS)[]) =>
  dropWhile((x) => x === WS.space, items);

const trimTrailing = (items: (string | WS)[]) =>
  trimLeading(items.reverse()).reverse();

const trimRepeating = (items: (string | WS)[]) => {
  const result: (string | WS)[] = [];
  for (const x of items) {
    if (x === WS.space && last(result) === WS.space) {
      // skip duplicate space
    } else {
      result.push(x);
    }
  }
  return result;
};
