import { dropWhile, last } from "./utils";
import { Line } from "./layout";

export function collapseSpaces(lines: Line[]): Line[] {
  return lines.map((line) => ({
    ...line,
    items: trimRepeating(trimTrailing(trimLeading(line.items as string[]))),
  }));
}

const trimLeading = (items: string[]) => dropWhile((x) => x === " ", items);

const trimTrailing = (items: string[]) =>
  trimLeading(items.reverse()).reverse();

const trimRepeating = (items: string[]) => {
  const result: string[] = [];
  for (const x of items) {
    if (x === " " && last(result) === " ") {
      // skip duplicate space
    } else {
      result.push(x);
    }
  }
  return result;
};
