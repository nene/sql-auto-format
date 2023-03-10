import { dropWhile, dropLastWhile, last } from "ramda";
import { isNewline, UnrolledLine, WS } from "./layout/LayoutTypes";

export function splitLines(lines: UnrolledLine[]): UnrolledLine[] {
  return lines.flatMap((line) => {
    if (line.items.includes(WS.newline)) {
      return splitLine(line);
    } else {
      return line;
    }
  });
}

function splitLine(line: UnrolledLine): UnrolledLine[] {
  const lines: UnrolledLine[] = [{ ...line, items: [] }];
  for (const x of trimTrailing(trimLeading(line.items))) {
    if (x === WS.newline) {
      if ((last(lines)?.items.length ?? 0) > 0) {
        lines.push({ ...line, items: [] });
      } else {
        // discard the extra line
      }
    } else {
      last(lines)?.items.push(x);
    }
  }
  return lines;
}

const trimLeading = dropWhile(isNewline);
const trimTrailing = dropLastWhile(isNewline);
